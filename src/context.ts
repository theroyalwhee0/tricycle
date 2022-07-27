import { IResponse, Response, ResponseBody } from './response';
import { Request, RequestParams } from './request';
import { Platform } from './platform';
import { None, NoneType } from './utilities/none';
import { Tricycle } from './tricycle';


export interface IContext<TBody extends ResponseBody = ResponseBody> extends IContextAliases {
    response: IResponse<TBody>,
    request: Request,
    platform: Platform,
}

export interface IContextAliases<TBody extends ResponseBody = ResponseBody> {
    url: string
    method: string
    body: TBody
    status: number
}

export class Context<TBody extends ResponseBody = ResponseBody> implements IContext {
    // REF: https://koajs.com/#request

    app: Tricycle

    response = new Response<TBody>();
    request = new Request();
    platform = new Platform();

    get params(): RequestParams {
        return this.request.params;
    }

    constructor(app: Tricycle) {
        this.app = app;
    }

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

    get status(): number | undefined {
        const value = this.response.status;
        if (value === None) {
            return undefined;
        } else {
            return value;
        }
    }

    set status(value: number) {
        this.response.status = value;
    }
}


/**
 * A context with more restricted types.
 */
export type RestrictContext<
    TContext extends IContext,
    TBody extends IContext['response']['body'],
    TStatus extends IContext['response']['status'],
    THeaders extends IContext['response']['headers'],
    > =
    TContext & {
        // Omit<TContext, 'body' | 'status'> & {
        // Response.
        body: TBody,
        status: number & TStatus,
        // Omit<TContext['response'], 'body' | 'status' | 'headers'>
        response: TContext['response'] & {
            body: TBody | NoneType,
            status: number & TStatus,
            headers: THeaders,
        }
    };
