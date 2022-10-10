import { Context as AzureContext } from "@azure/functions";
import { BaseContext, ContextKind, Context } from "../context";
import { Tricycle } from "../tricycle";

export class HttpContext<TContext extends Context=Context> extends BaseContext<TContext>  {
    readonly kind: ContextKind;
    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        super(tricycle, azureContext);
        this.kind = ContextKind.Http;
    }
}
