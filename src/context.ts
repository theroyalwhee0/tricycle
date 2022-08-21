import {
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
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

    app: Tricycle;
    response:Response<TBody>;
    request:Request;
    platform:Platform;
    
    /**
     * Construct an instance of Context.
     * NOTE: Some items are references to the original data, not copies.
     * @param app 
     * @param azureContext 
     * @param azureRequest 
     */
    constructor(app: Tricycle, azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) {
        this.app = app;
        this.response = new Response<TBody>(azureContext, azureRequest);
        this.platform = new Platform(azureContext, azureRequest);
        this.request = new Request(azureContext, azureRequest);
    }

    /**
     * Create an instance of Context.
     * NOTE: Some items are references to the original data, not copies.
     * @param app The Tricycle app.
     * @param azureContext The Azure context.
     * @param azureRequest The Azure request.
     * @returns A new instance of Context.
     */
    static create<TContext extends IContext>(app: Tricycle, azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>): TContext {
        return new Context(app, azureContext, azureRequest) as unknown as TContext;
    }

    get params(): RequestParams {
        return this.request.params;
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
        // Response.
        body: TBody,
        status: number & TStatus,
        response: TContext['response'] & {
            body: TBody | NoneType,
            status: number & TStatus,
            headers: THeaders,
        }
    };
