import { Context as AzureContext, HttpRequest as AzureHttpRequest } from '@azure/functions';
import { isArray, isObject } from '@theroyalwhee0/istype';
import { Tricycle } from '../app';
import { Context } from '../context';
import { MimeTypes } from '../mimetypes';
import { JsonArray, JsonObject, JsonValue } from '../utilities/json';
import { CaseInsensitiveHeaders, HeaderNames, Headers } from './headers';

/**
 * The HTTP Request body types.
 */
export type RequestBody = JsonValue | undefined;

/**
 * The HTTP Request with a restricted body type.
 */
export type GuardRequestBody<TRequest extends IHttpRequest, TBody extends RequestBody> = (
    Omit<TRequest, 'body'> & (TRequest['body'] & TBody)
);

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
 * Azure HTTP Request with additional members.
 */
type AzureHttpRequestEx = AzureHttpRequest & {
    // Add optional originalUrl to HttpRequest.
    // REF: https://github.com/Azure/azure-functions-nodejs-worker/issues/589
    originalUrl?: string
};

export interface IHttpRequest {
    type: string,
    method: string,
    headers: Headers,
    ip: string,
    originalUrl: string
    URL: URL
    url: string
    href: string
    path: string
    search: string
    querystring: string
    query: Readonly<Record<string, string>>
    params: Readonly<Record<string, string>>
    body: RequestBody
    is(...mimeTypes: string[]): boolean | null | string;
    isType<K extends MimeBodyKeys | string>(mimeType: K): this is GuardRequestBody<this, K extends MimeBodyKeys ? MimeBodyMap[K] : RequestBody>;
    isJson<T extends JsonValue = JsonValue>(): this is GuardRequestBody<this, T>;
    isJsonObject<T extends JsonObject = JsonObject>(): this is GuardRequestBody<this, T>;
    isJsonArray<T extends JsonArray = JsonArray>(): this is GuardRequestBody<this, T>;
}

export class HttpRequest<TContext extends Context = Context> implements IHttpRequest {
    readonly #azureContext: Readonly<AzureContext>;
    readonly #req: Readonly<AzureHttpRequestEx>;
    readonly headers: Headers;
    readonly originalUrl: string;

    #URL?: URL;
    #ip?: string;

    constructor(_tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        if (!azureContext.req) {
            throw new Error('Expected Azure Context \'req\' to be an HttpRequest');
        }
        this.#azureContext = azureContext;
        const req: AzureHttpRequestEx = this.#req = azureContext.req;
        this.headers = new CaseInsensitiveHeaders(req.headers);
        this.originalUrl = req.originalUrl ?? req.url;
    }

    /**
     * Get the
     */
    get URL(): URL {
        if (!this.#URL) {
            this.#URL = new URL(this.#req.url);
        }
        return this.#URL;
    }

    /**
     * Get the query string as an object.
     * REF: https://github.com/koajs/koa/blob/master/docs/api/request.md#requestquery
     */
    get query(): Readonly<Record<string, string>> {
        const data: Record<string, string> = {};
        this.URL.searchParams.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    /**
     * Get the named route parameters as an object.
     * REF: https://github.com/koajs/router/blob/master/API.md#url-parameters
     */
     get params(): Readonly<Record<string, string>> {
        return this.#req.params;
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
     * Get the HTTP method for the request.
     */
    get method(): string {
        if (this.#req.method === null) {
            throw new Error('Expected Azure Request \'method\' to be a string');
        }
        return this.#req.method;
    }


    /**
     * Get the originating IP address.
     */
    get ip(): string {
        if (this.#ip === undefined) {
            const forwardedFor = (this.headers[HeaderNames.ForwardedFor] ?? '').split(',');
            this.#ip = forwardedFor[forwardedFor.length - 1].trim();
        }
        return this.#ip;
    }

    /**
     * The body if present.
     * NOTE: There is no guarantee the body type actually is TBody,
     * use is* guards.
     */
    get body(): RequestBody {
        return this.#req.body;
    }

    /**
     * Check to see if the request's mime type is within the given set.
     * @param mimeTypes List of mime types to check against. 
     * @returns null if there is no body, false if it does not match, the mime type if there is a match.
     */
    is(...mimeTypes: string[]): boolean | null | string {
        // TODO: This does not impliment pattern matching (image/*).
        // TODO: This does not impliment mime type aliases (json).
        if (this.body === undefined) {
            return null;
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
    isType<K extends MimeBodyKeys | string>(mimeType: K): this is GuardRequestBody<this, K extends MimeBodyKeys ? MimeBodyMap[K] : RequestBody> {
        return !!this.is(mimeType);
    }

    /**
     * Check to see if the request's mime type is a JSON value.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    isJson<T extends JsonValue = JsonValue>(): this is GuardRequestBody<this, T> {
        return this.isType(MimeTypes.ApplicationJson);
    }

    /**
     * Check to see if the request's mime type is a JSON object.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    // extends JsonObject
    isJsonObject<T extends JsonObject = JsonObject>(): this is GuardRequestBody<this, T> {
        return isObject(this.body) && this.isJson();
    }

    /**
     * Check to see if the request's mime type is a JSON array.
     * Similar to is() but for a single known type as a type guard.
     * @param mimeType The mime type from known types.
     * @returns True if found, false if not.
     */
    isJsonArray<T extends JsonArray = JsonArray>(): this is GuardRequestBody<this, T> {
        return isArray(this.body) && this.isJson();
    }

    /**
     * The content type.
     */
    get type(): string {
        return this.headers[HeaderNames.ContentType] ?? '';
    }
}
