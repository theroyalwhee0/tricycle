import {
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
// import { URL } from 'node:url';
import { isArray, isObject } from "@theroyalwhee0/istype"
import { JsonArray, JsonObject, JsonValue } from "./utilities/json"
import { CaseInsensitiveHeaders, HeaderNames, Headers } from './headers';
import { MimeTypes } from "./mimetypes";

/**
 * Azure HTTP Request with additional members.
 */
type AzureHttpRequestEx = AzureHttpRequest & {
    // Add optional originalUrl to HttpRequest.
    // REF: https://github.com/Azure/azure-functions-nodejs-worker/issues/589
    originalUrl?: string
};

/**
 * The HTTP Request URL Parameters type.
 */
export type RequestParams = Record<string, string>

/**
 * The HTTP Request interface.
 */
export interface IRequest {
    method: string
    body?: JsonValue
    rawBody?: string
    params: RequestParams

    ip:string
    
    URL: URL
    url: string
    href: string
    path: string
    search:string
    querystring: string
    query:Readonly<Record<string,string>>


    /**
     * The size of the request body.
     * From content-length header when present or undefined.
     * REF: https://github.com/koajs/koa/blob/master/docs/api/response.md#responselength-1
     */
    length: number | undefined
}

/**
 * The HTTP Response body types.
 */
export type RequestBody = JsonValue;

/**
 * The HTTP Request with a specialized body type.
 */
export type RequestWithBody<T extends RequestBody> = RequiredProperty<Request<T>, 'body'>

/**
 *  Create type with a specific property required.
 */
type RequiredProperty<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};

/**
 * Mapping of mime type strings to body types.
 */
export type MimeBodyMap = {
    'application/json': JsonValue
}

/**
 * The keys in a mime type to body mapping.
 */
export type MimeBodyKeys = keyof MimeBodyMap;

/**
 * The HTTP Request.
 */
export class Request<TBody extends RequestBody = JsonValue> implements IRequest {
    /**
     * Reference to the current Azure Context.
     */
    #azureContext: Readonly<AzureContext>

    /**
     * Reference to the current Azure Request.
     */
    #azureRequest: Readonly<AzureHttpRequest>

    /**
     * The original request URL.
     */
    originalUrl: string

    /**
     * The request URL object.
     */
    URL: URL;

    /**
     * The mime type for the request.
     * An empty string if not given.
     */
    #type: string | undefined

    /**
     * The reqeust headers.
     */
    headers: Headers

    /**
     * The ip address of the client.
     * An empty string if not known.
     */
    #ip: string | undefined

    /**
     * Create an instance of the Context.Request.
     * @param azureContext The current Azure Context.
     * @param azureRequest The current Azure Request.
     */
    constructor(azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) {
        this.#azureContext = azureContext;
        this.#azureRequest = azureRequest;
        const url = azureRequest.url;
        const originalUrl = (<AzureHttpRequestEx>azureRequest).originalUrl ?? '';
        this.URL = new URL(url);
        this.originalUrl = originalUrl || url;
        this.headers = new CaseInsensitiveHeaders(azureRequest.headers);
    }

    get type():string {
        if(this.#type === undefined) {
            this.#type = this.headers[HeaderNames.ContentType] ?? '';
        }
        return this.#type;
    }

    /**
     * Get the originating IP address.
     */
    get ip():string {
        if(this.#ip === undefined) {
            const forwardedFor = (this.headers[HeaderNames.ForwardedFor] ?? '').split(',');
            this.#ip = forwardedFor[forwardedFor.length-1].trim()
        }
        return this.#ip;
    }

    /**
     * Get the request url, includes the protocol, host, path and querystring.
     * Example:
     *  Given 'https://www.example.com:443/login?campaign=summer'
     *  Results in 'https://www.example.com:443/login?campaign=summer'
     * REF: https://github.com/koajs/koa/blob/master/docs/api/request.md#requesthref
     */
    get href(): string {
        return this.URL.href;
    }

    /**
     * Set the href from a string.
     */
    set href(value: string) {
        this.URL.href = value;
    }
    
    /**
     * Get request path, includes just the path with a leading '/'.
     * Example:
     *  Given 'https://www.example.com:443/login?campaign=summer'
     *  Results in '/login'
     * https://github.com/koajs/koa/blob/master/docs/api/request.md#requestpath
     */
    get path(): string {     
        return this.URL.pathname;   
    } 

    /**
     * Get the request url, includes the path and querystring.
     * Example:
     *  Given 'https://www.example.com:443/login?campaign=summer'
     *  Results in '/login?campaign=summer'
     * REF: https://github.com/koajs/koa/blob/master/docs/api/request.md#requesturl
     */
     get url(): string {
        return this.URL.pathname + this.URL.search;
    }

    /**
     * Get the query string minus the '?'.
     * Example:
     *  Given 'https://www.example.com:443/login?campaign=summer'
     *  Results in 'campaign=summer'
     * REF: https://github.com/koajs/koa/blob/master/docs/api/request.md#requestquerystring
     */
    get querystring(): string {     
        return this.URL.search.slice(1);   
    } 
    
    /**
     * Get the query string including the '?'.
     * Example:
     *  Given 'https://www.example.com:443/login?campaign=summer'
     *  Results in '?campaign=summer'
     * REF: https://github.com/koajs/koa/blob/master/docs/api/request.md#requestsearch
     */
    get search(): string {     
        return this.URL.search;
    } 

    /**
     * Get the query string as an object.
     * REF: https://github.com/koajs/koa/blob/master/docs/api/request.md#requestquery
     */
    get query(): Readonly<Record<string,string>> {
        const data:Record<string,string> = {};
        this.URL.searchParams.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    /**
     * Get the size of the request body.
     * From content-length header when present or undefined.
     * REF: https://github.com/koajs/koa/blob/master/docs/api/response.md#responselength-1
     */
    length: number;

    /**
     * Get the HTTP method for the request.
     */
    get method(): string {
        return this.#azureRequest.method;
    }

    /**
     * Get the URL parameters.
     */
    get params(): RequestParams {
        return this.#azureContext.req.params;
    }

    /**
     * The body if present.
     * NOTE: There is no guarantee the body type actually is TBody, use isType* guards.
     */
    get body(): TBody | undefined {
        return this.#azureRequest.body;
    }

    /**
     * The raw, unparsed body if present.
     */
    get rawBody(): string | undefined {
        return this.#azureRequest.rawBody;
    }

    /**
     * Check to see if the request's mime type is within the given set.
     * @param mimeTypes List of mime types to check against. 
     * @returns null if there is no body, false if it does not match, the mime type if there is a match.
     */
    is(...mimeTypes: string[]): boolean | null | string {
        // NOTE: This does not impliment pattern matching (image/*).
        // NOTE: This does not impliment mime type aliases (json).
        if (this.body === undefined) {
            return null
        } else if (mimeTypes.includes(this.type)) {
            return this.type;
        } else {
            return false;
        }
    }

    /**
     * Check to see if the request's mime type is a specific known type.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    isType<K extends MimeBodyKeys | string>(mimeType: K): this is RequestWithBody<K extends MimeBodyKeys ? MimeBodyMap[K] : RequestBody> {
        return !!this.is(mimeType);
    }

    /**
     * Check to see if the request's mime type is a JSON value.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    isJson<T extends JsonValue = JsonValue>(): this is RequestWithBody<T> {
        return this.isType(MimeTypes.ApplicationJson);
    }

    /**
     * Check to see if the request's mime type is a JSON object.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    isJsonObject<T extends JsonObject = JsonObject>(): this is RequestWithBody<T> {
        return isObject(this.body) && this.isJson();
    }

    /**
     * Check to see if the request's mime type is a JSON array.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    isJsonArray<T extends JsonArray = JsonArray>(): this is RequestWithBody<T> {
        return isArray(this.body) && this.isJson();
    }
}