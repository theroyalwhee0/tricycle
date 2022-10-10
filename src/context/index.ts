import { Context as AzureContext } from "@azure/functions";
import { IPlatform } from "../platform/platform";
import { Tricycle } from "../tricycle";

/**
 * Base Tricycle context.
 */
export type Context = {
    readonly kind: ContextKind,
    readonly app: Tricycle<Context>;
    readonly platform: IPlatform,
};

/**
 * Base Context.
 */
export class BaseContext<TContext extends Context> implements Context  {
    readonly kind: ContextKind;
    readonly app: Tricycle<Context>;
    readonly platform: IPlatform;

    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        this.kind = ContextKind.Unknown;
        this.app = tricycle;
        this.platform = { azureContext };
    }
}

/**
 * Kinds of functions.
 */
 export enum ContextKind {
    Unknown,
    Http,
    Timer,
};
