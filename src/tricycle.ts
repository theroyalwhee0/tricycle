import {
    AzureFunction,
    Context as AzureContext,
} from '@azure/functions';
import { compose } from './compose';
import { Context } from "./context";
import { HttpContext } from './http/context';
import { Middleware } from "./middleware";
import { AzureTimerInfo, TimerFunction } from './timer';
import { TimerContext } from './timer/context';

/**
 * The main Tricycle application class.
 */
export class Tricycle<TContext extends Context> {
    /**
     * Middleware list.
     */
    readonly #middleware: Middleware<TContext>[] = [];

    /**
     * Attach a middleware function.
     * @param middlware The middleware to attach.
     * @returns This.
     */
    use(middlware: Middleware<TContext>): this {
        this.#middleware.push(middlware);
        return this;
    }

    /**
     * Invoke middleware in order.
     * @param context The context for this request.
     * @param fn The last piece of middleware to run, not cached in compose cache.
     */
    async #invokeMiddleware(ctx: TContext, fn: Middleware<TContext>): Promise<unknown> {
        const composed = compose(this.#middleware);
        const next = fn.bind(null, ctx);
        return composed(ctx, next)
    }

    /**
     * Create an Azure HTTP endpoint function.
     * @param fn The endpoint function.
     * @returns An AzureFunction HTTP endpoint.
     */
    endpoint(fn: Middleware<TContext>): AzureFunction {
        return async (azureContext: Readonly<AzureContext>) => {
            type TContextWithHttp = TContext & HttpContext<TContext>;
            const context:TContextWithHttp = new HttpContext<TContext>(this, azureContext) as TContextWithHttp;
            // NOTE: Context is incomplete at this point, middleware may add to it.
            await this.#invokeMiddleware(context, fn);
        };
    }

    /**
     * Create an Azure Timer function.
     * @param fn The timer function.
     * @returns An AzureFunction timer.
     */
     timer(fn:TimerFunction<TContext>):AzureFunction {
        return async (azureContext: Readonly<AzureContext>, timerInfo:AzureTimerInfo): Promise<void> => {
            type TContextWithTimer = TContext & TimerContext<TContext>;
            const context:TContextWithTimer = new TimerContext<TContext>(this, azureContext, timerInfo) as TContextWithTimer;
            // NOTE: Context is incomplete at this point, middleware may add to it.
            await this.#invokeMiddleware(context, fn);
        }
    }
}
