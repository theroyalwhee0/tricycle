import {
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
import { Headers, CaseInsensitiveHeaders } from "./headers"
import { JsonValue } from "./utilities/json"
import { None, NoneType } from "./utilities/none"

/**
 * The HTTP Response body types.
 */
export type ResponseBody = JsonValue;

/**
 * The HTTP Response interface.
 */
export interface IResponse<TBody extends ResponseBody = ResponseBody> {
    body: TBody | NoneType
    status: number | NoneType
    headers: Headers
}

/**
 * The HTTP Response.
 */
export class Response<TBody extends ResponseBody = ResponseBody> implements IResponse {
    #azureContext: Readonly<AzureContext>;
    #azureRequest: Readonly<AzureHttpRequest>;

    body: TBody | NoneType = None
    status: number | NoneType = None
    #headers: Headers = new CaseInsensitiveHeaders();

    constructor(azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) {
        this.#azureContext = azureContext;
        this.#azureRequest = azureRequest;
    }

    /**
     * Get the headers object.
     */
    get headers(): Headers {
        return this.#headers;
    }

    /**
     * Set the headers object.
     */
    set headers(value: Headers) {
        this.#headers = new CaseInsensitiveHeaders(value);
    }

    /**
     * Does the headers object have the given header?
     * @param name The header name to check for.
     * @returns True if found, false if not.
     */
    has(name: string): boolean {
        return name in this.#headers;
    }

    /**
     * Get the given header by name.
     * @param name The header name to check for.
     * @returns Undefined if the header does not exist, the string value if it does.
     */
    get(name: string): string | undefined {
        return this.#headers[name];
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
