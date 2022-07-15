import { Headers, CaseInsensitiveHeaders } from "./headers"
import { HttpStatus } from "./httpstatus"
import { JsonValue } from "./utilities/json"
import { None, NoneType } from "./utilities/none"

export interface IResponse {
    body: JsonValue | NoneType
    status: HttpStatus | NoneType
    headers: Headers
}

export class Response implements IResponse {
    body: JsonValue | NoneType = None
    status: HttpStatus | NoneType = None
    #headers: Headers = new CaseInsensitiveHeaders();

    get headers(): Headers {
        return this.#headers;
    }

    set headers(value: Headers) {
        this.#headers = new CaseInsensitiveHeaders(value);
    }

    has(name: string): boolean {
        return name in this.#headers;
    }

    get(name: string): string | undefined {
        return this.#headers[name];
    }

    setHeader(name: string, value: string) {
        this.#headers[name] = value;
    }
}
