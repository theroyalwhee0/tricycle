import { IResponse, Response, ResponseBody } from './response';
import { Request } from './request';
import { Platform } from './platform';
// import { HttpStatus } from './httpstatus';
import { None, NoneType } from './utilities/none';


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
//  TBody extends ResponseBody = JsonObject,

export type RestrictContext<
    TContext extends IContext,
    TBody extends IContext['response']['body'],
    TStatus extends IContext['response']['status'],
    THeaders extends IContext['response']['headers'],
    > =
    Omit<TContext, 'body'> & {
        // Response.
        body: TBody,
        status: number & TStatus,
        response: Omit<TContext['response'], 'body' | 'status' | 'headers'> & {
            body: TBody | NoneType,
            status: number & TStatus,
            headers: THeaders,
        }
    };

/**
 * Remove the restructions on a restricted context.
 */
export type UnrestrictContext<TContext extends Context> = TContext;
    // Omit<TContext, 'body'> & {
    //     body: TContext['body'],
    //     response: Omit<TContext['response'], 'body'> & {
    //         body: TContext['body'],
    //     }
    // };
