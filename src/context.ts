import { IResponse, Response, ResponseBody } from './response';
import { Request } from './request';
import { Platform } from './platform';
import { HttpStatus } from './httpstatus';
import { None } from './utilities/none';


export interface IContext<TBody extends ResponseBody = ResponseBody> extends IContextAliases {
    response: IResponse<TBody>,
    request: Request,
    platform: Platform,
}

export interface IContextAliases<TBody extends ResponseBody = ResponseBody> {
    url: string
    method: string
    body: TBody
    status: HttpStatus
}

export class Context<TBody extends ResponseBody = ResponseBody> implements IContext {
    // REF: https://koajs.com/#request

    response = new Response<TBody>();
    request = new Request();
    platform = new Platform();

    get url(): string {
        return this.request.url;
    }

    get method(): string {
        return this.request.method;
    }

    get body(): TBody | undefined {
        const value = this.response.body;
        if (value === None) {
            return undefined;
        } else {
            return value;
        }
    }

    set body(value: TBody) {
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
