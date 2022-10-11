import { Context as AzureContext } from "@azure/functions";
import { Tricycle } from "../app";
import { BaseContext, ContextKind, Context } from "../context";
import { HttpRequest, IHttpRequest } from "./request";
import { HttpResponse, IHttpResponse } from "./response";

export interface IHttpContext {
    readonly req?:IHttpRequest
    readonly res?:IHttpResponse
};

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
