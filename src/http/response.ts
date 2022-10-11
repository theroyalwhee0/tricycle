import { Context as AzureContext } from "@azure/functions";
import { Tricycle } from "../app";
import { Context } from "../context";

export interface IHttpResponse {
};

export class HttpResponse<TContext extends Context=Context> implements IHttpResponse {
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
    }
}
