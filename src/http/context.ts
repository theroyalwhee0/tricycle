import { Context as AzureContext } from '@azure/functions';
import { Tricycle } from '../app';
import { BaseContext, ContextKind, Context } from '../context';
import { RequiredKeys } from '../utilities/types';
import { HttpRequest, IHttpRequest } from './request';
import { HttpResponse, IHttpResponse } from './response';

export interface IHttpContext {
    readonly request?:IHttpRequest
    readonly response?:IHttpResponse
}

export class HttpContext<TContext extends Context=Context> extends BaseContext<TContext> implements IHttpContext {
    readonly kind: ContextKind;
    readonly request?: IHttpRequest;
    readonly response?: IHttpResponse;
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        super(tricycle, azureContext);
        this.kind = ContextKind.Http;
        this.request = new HttpRequest(tricycle, azureContext);
        this.response = new HttpResponse(tricycle, azureContext);
    }
}

export type HttpContextRequired<TContext extends Context>  = TContext & RequiredKeys<HttpContext<TContext>, 'request' | 'response'>;
