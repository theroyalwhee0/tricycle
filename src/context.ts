import { IResponse, Response } from './response';
import { IRequest, Request } from './request';
import { IPlatform, Platform } from './platform';
import { JsonValue } from './utilities/json';
import { HttpStatus } from './httpstatus';
import { None } from './utilities/none';

export interface IContext {
    response: IResponse
    request: IRequest
    platform: IPlatform
    // Request.
    url: string
    method: string
    // Response.
    body: JsonValue
    status: HttpStatus
}

export class Context implements IContext {
    // REF: https://koajs.com/#request

    response: Response = new Response()
    request: Request = new Request();
    platform: Platform = new Platform()

    get url(): string {
        return this.request.url;
    }

    get method(): string {
        return this.request.method;
    }

    get body(): JsonValue | undefined {
        const value = this.response.body;
        if (value === None) {
            return undefined;
        } else {
            return value;
        }
    }

    set body(value: JsonValue) {
        this.response.body = value;
    }

    get status(): HttpStatus | undefined {
        const value = this.response.status;
        if (value === None) {
            return undefined;
        } else {
            return value;
        }
    }

    set status(value: HttpStatus) {
        this.response.status = value;
    }
}
