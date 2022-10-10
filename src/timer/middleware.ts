import { ContextKind, Context } from "../context";
import { Middleware, Next } from "../middleware";

/**
 * Create Timer-only middeware wrapper.
 * @param middleware 
 * @returns 
 */
export function timerMiddleware<TContext extends Context>(middleware: Middleware<TContext>): Middleware<TContext> {
    return (ctx: TContext, next: Next) => {
        if(ctx.kind === ContextKind.Timer) {
            return middleware(ctx, next);
        } else {
            return next();
        }
    };
}
