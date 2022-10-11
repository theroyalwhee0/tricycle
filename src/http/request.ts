import { Context as AzureContext, HttpRequest as AzureHttpRequest } from "@azure/functions";
import { Tricycle } from "../app";
import { Context } from "../context";
import { None, NoneType } from "../utilities/none";
import { Headers, CaseInsensitiveHeaders, HeaderNames } from "./headers";

/**
 * Azure HTTP Request with additional members.
 */
type AzureHttpRequestEx = AzureHttpRequest & {
    // Add optional originalUrl to HttpRequest.
    // REF: https://github.com/Azure/azure-functions-nodejs-worker/issues/589
    originalUrl?: string
};

export interface IHttpRequest { 
    method: string,
    headers: Headers,
    ip: string, 
    originalUrl: string
    URL: URL
    url: string
    href: string
    path: string
    search:string
    querystring: string
    query: Readonly<Record<string,string>>
};

export class HttpRequest<TContext extends Context=Context> implements IHttpRequest {
    readonly #azureContext: Readonly<AzureContext>
    readonly #req: Readonly<AzureHttpRequestEx>
    readonly headers: Headers;    
    readonly originalUrl: string;
    #URL?:URL
    #ip?: string;

    constructor(_tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        if(!azureContext.req) {
            throw new Error(`Expected Azure Context 'req' to be an HttpRequest`);
        }
        this.#azureContext = azureContext;
        const req:AzureHttpRequestEx = this.#req = azureContext.req;
        this.headers = new CaseInsensitiveHeaders(req.headers);        
        this.originalUrl = req.originalUrl ?? req.url;
    }

    /**
     * Get the
     */
    get URL():URL {
        if(!this.#URL) {
            this.#URL = new URL(this.#req.url);
        }
        return this.#URL;
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
        if(this.#req.method === null) {
            throw new Error(`Expected Azure Request 'method' to be a string`);
        }
        return this.#req.method;
    }


    /**
     * Get the originating IP address.
     */
     get ip():string {
        if(this.#ip === undefined) {
            const forwardedFor = (this.headers[HeaderNames.ForwardedFor] ?? '').split(',');
            this.#ip = forwardedFor[forwardedFor.length-1].trim();
        }
        return this.#ip;
    }    
}
