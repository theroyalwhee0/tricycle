import { ContextKind, Context } from "../context";
import { Middleware, Next } from "../middleware";

/**
 * Create HTTP-only middeware wrapper.
 * @param middleware 
 * @returns 
 */
export function httpMiddleware<TContext extends Context>(middleware: Middleware<TContext>): Middleware<TContext> {
    return (ctx: TContext, next: Next) => {
        if(ctx.kind === ContextKind.Http) {
            return middleware(ctx, next);
        } else {
            return next();
        }
    };
}
