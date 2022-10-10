import { AzureFunction, Context as AzureContext } from '@azure/functions';
import { compose } from './compose';
import { Context } from "./context";
import { Middleware, TricycleFunction } from "./middleware";
import { AzureTimerInfo, TimerFunction } from './timer';
import { TimerContext } from './timer/context';
import { HttpFunction } from './http';
import { HttpContext } from './http/context';
//import { httpMiddleware } from './http/middleware';
//import { timerMiddleware } from './timer/middleware';

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
    async #invokeMiddleware(ctx: TContext, fn: TricycleFunction): Promise<void> {
        const composed = compose(this.#middleware);
        const next = fn.bind(null, ctx);
        // NOTE: Context is incomplete at this point, middleware may add to it whenever it likes.
        // Custom required properties may not be populated until the matching middleware runs.
        return composed(ctx, next)
    }

    /**
     * Create an Azure HTTP endpoint function.
     * @param fn The endpoint function.
     * @returns An AzureFunction HTTP endpoint.
     */
    endpoint(fn: HttpFunction<TContext>): AzureFunction {
        return async (azureContext: Readonly<AzureContext>) => {
            type TContextWithHttp = TContext & HttpContext<TContext>;
            const context:TContextWithHttp = new HttpContext<TContext>(this, azureContext) as TContextWithHttp;
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
            await this.#invokeMiddleware(context, fn);
        }
    }
}

// const app = new Tricycle()
//     .use(httpMiddleware((ctx) => {
//         console.log("HTTP only", !!ctx.req);
//     }))
//     .use(timerMiddleware((ctx) => {
//         console.log("Timer only", !!ctx.timer);
//     }));

// const _ep = app.endpoint((ctx) => {
//     console.log("@@ endpoint", ctx.res);
// });

// const _tm = app.timer((ctx) => {
//     console.log("@@ timer");
//     console.log("@@ endpoint", ctx.timer);
// });
