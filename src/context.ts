import { Response, ResponseBody } from './response';
import { Request } from './request';
import { Platform } from './platform';
import { HttpStatus } from './httpstatus';
import { None } from './utilities/none';


export class Context<TBody extends ResponseBody = ResponseBody> {
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
