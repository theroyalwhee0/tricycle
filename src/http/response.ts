import { Context as AzureContext } from "@azure/functions";
import { Tricycle } from "../app";
import { Context } from "../context";
import { JsonValue } from "../utilities/json";
import { None, NoneType } from "../utilities/none";
import { Headers, CaseInsensitiveHeaders } from "./headers";

/**
 * The HTTP Response body types.
 */
export type ResponseBody = JsonValue|undefined;

/**
 * Response Interface.
 */
export interface IHttpResponse<TBody extends ResponseBody=ResponseBody> {
    status: number | NoneType
    body: TBody | NoneType
    headers: Headers
};

/**
 * HTTP Response.
 */
export class HttpResponse<TContext extends Context=Context> implements IHttpResponse {
    #headers: Headers = new CaseInsensitiveHeaders();
    status: number | NoneType = None
    body: ResponseBody | NoneType = None

    /**
     * Construct new HTTP Response.
     * @param _tricycle Tricycle application. Unused.
     * @param _azureContext Azure Context. Unused.
     */
    constructor(_tricycle: Tricycle<TContext>, _azureContext: Readonly<AzureContext>) {
    }

    /**
     * Get headers.
     */
    get headers():Headers {
        return this.#headers;
    }

    /**
     * Set headers.
     * Replaces existing headers.
     */
    set headers(headers:Headers) {
        this.#headers = new CaseInsensitiveHeaders(headers);
    }    

    /**
     * Does the headers object have the given header?
     * @param name The header name to check for.
     * @returns True if found, false if not.
     */
    has(name: string): boolean {
        return name in this.headers;
    }

    /**
     * Get the given header by name.
     * @param name The header name to check for.
     * @returns Undefined if the header does not exist, the string value if it does.
     */
    get(name: string): string | undefined {
        return this.headers[name];
    }    

    /**
     * Set the given header by name.
     * @param name The header name to check set.
     * @param value The value to set the header to.
     */
    set(name: string, value: string) {
        this.#headers[name] = value;
    }  
}
