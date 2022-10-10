import { Context as AzureContext } from "@azure/functions";
import { Tricycle } from "../tricycle";
import { BaseContext, ContextKind, Context } from "../context";

export interface IHttpRequest {  
    originalUrl: string
    URL: URL; 
    headers: Headers,
};

export interface IHttpResponse {
};

export interface IHttpContext {
    readonly req?:IHttpRequest
    readonly res?:IHttpResponse
};

export class HttpRequest<TContext extends Context=Context> implements IHttpRequest {
    originalUrl: string;
    URL: URL;
    headers: Headers;    
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
    }
}

export class HttpResponse<TContext extends Context=Context> implements IHttpResponse {
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
    }
}

export class HttpContext<TContext extends Context=Context> extends BaseContext<TContext> implements IHttpContext {
    readonly kind: ContextKind;
    readonly req?: IHttpRequest;
    readonly res?: IHttpResponse;
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        super(tricycle, azureContext);
        this.kind = ContextKind.Http;
        this.req = new HttpRequest(tricycle, azureContext);
        this.res = new HttpResponse(tricycle, azureContext);
    }
}
