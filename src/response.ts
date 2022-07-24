import { Headers, CaseInsensitiveHeaders } from "./headers"
import { HttpStatus } from "./httpstatus"
import { JsonValue } from "./utilities/json"
import { None, NoneType } from "./utilities/none"

export type ResponseBody = JsonValue;

export interface IResponse<TBody extends ResponseBody = ResponseBody> {
    body: TBody | NoneType
    status: HttpStatus | NoneType
    headers: Headers
}

//  implements IResponse<TBody> 

export class Response<TBody extends ResponseBody = ResponseBody> implements IResponse {
    body: TBody | NoneType = None
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
