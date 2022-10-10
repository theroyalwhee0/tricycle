import { Context } from "../context";
import { Headers } from './headers';

/**
 * The HTTP Response interface.
 */
 export interface IHttpResponse {
    body?: unknown
    status?: number
    headers: Headers
}

/**
 * The HTTP Request interface.
 */
 export interface IHttpRequest {
    method: string
    body?: unknown
    rawBody?: string
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

export interface IHttpContext extends Context {
    response: IHttpResponse,
    request: IHttpRequest,    
}