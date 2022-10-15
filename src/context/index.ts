import { Context as AzureContext } from '@azure/functions';
import { Tricycle } from '../app';
import { IPlatform } from '../platform/platform';


/**
 * Context Properties that should be removed dependant on kind.
 */
export type RemovableContextProperties = 'timer'|'response'|'request';

/**
 * Base Tricycle context.
 */
export type Context = {
    readonly kind: ContextKind,
    // readonly app: Tricycle<Context>;
    readonly platform: IPlatform,
};

/**
 * Base Context.
 */
export class BaseContext<TContext extends Context> implements Context  {
    readonly kind: ContextKind;
    // readonly app: Tricycle<TContext>;
    readonly platform: IPlatform;

    constructor(tricycle: Tricycle<TContext>, azureContext: Readonly<AzureContext>) {
        this.kind = ContextKind.Unknown;
        // this.app = tricycle;
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
}
