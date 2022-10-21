import { AzureFunction, Context as AzureContext } from '@azure/functions';
import { Context } from '../context';
import { ContextEndpoint, HttpFunction, IEndpoint } from '../http';
import { HttpContext, HttpContextRequired, IHttpContext } from '../http/context';
import { transformHttpResponse } from '../http/transform';
import { Middleware, TricycleFunction } from '../middleware';
import { compose } from '../middleware/compose';
import { AzureTimerInfo, TimerFunction } from '../timer';
import { ITimerContext, TimerContext } from '../timer/context';

/**
 * Main Tricycle Context.
 */
export type TricycleContext<TContext extends Context=Context> = (
    TContext & IHttpContext & ITimerContext
);

/**
 * The main Tricycle application class.
 */
export class Tricycle<TContext extends Context = TricycleContext> {
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
    async #invokeMiddleware(ctx: TContext, fn: TricycleFunction): Promise<void> {
        const composed = compose(this.#middleware);
        const next = fn.bind(null, ctx);
        // NOTE: Context is incomplete at this point, middleware may add to it whenever it likes.
        // Custom required properties may not be populated until the matching middleware runs.
        return composed(ctx, next);
    }

    /**
     * Create an Azure HTTP endpoint function.
     * @param fn The endpoint function.
     * @returns An AzureFunction HTTP endpoint.
     */
    endpoint<TEndpoint extends IEndpoint = ContextEndpoint>(fn: HttpFunction<TContext, TEndpoint>): AzureFunction {
        return async (azureContext: Readonly<AzureContext>) => {
            const ctx = new HttpContext<TContext>(this, azureContext) as TContext;
            await this.#invokeMiddleware(ctx, fn);
            await transformHttpResponse(ctx as HttpContextRequired<TContext>);
        };
    }

    /**
     * Create an Azure Timer function.
     * @param fn The timer function.
     * @returns An AzureFunction timer.
     */
    timer(fn: TimerFunction<TContext>): AzureFunction {
        return async (azureContext: Readonly<AzureContext>, timerInfo: AzureTimerInfo): Promise<void> => {
            const ctx = new TimerContext<TContext>(this, azureContext, timerInfo) as TContext;
            await this.#invokeMiddleware(ctx, fn);
        };
    }
}
