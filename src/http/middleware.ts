import { ContextKind, Context } from "../context";
import { OnlyHttp } from "../context/restrict";
import { Middleware, Next } from "../middleware";

/**
 * Create HTTP-only middeware wrapper.
 * @param middleware 
 * @returns 
 */
export function httpMiddleware<TContext extends Context>(middleware: Middleware<OnlyHttp<TContext>>): Middleware<TContext> {
    return (ctx: TContext, next: Next) => {
        if(ctx.kind === ContextKind.Http) {
            return middleware(ctx as unknown as OnlyHttp<TContext>, next);
        } else {
            return next();
        }
    };
}
