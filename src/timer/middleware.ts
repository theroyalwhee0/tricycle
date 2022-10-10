import { ContextKind, Context } from "../context";
import { OnlyTimer } from "../context/restrict";
import { Middleware, Next } from "../middleware";

/**
 * Create Timer-only middeware wrapper.
 * @param middleware 
 * @returns 
 */
export function timerMiddleware<TContext extends Context>(middleware: Middleware<OnlyTimer<TContext>>): Middleware<TContext> {
    return (ctx: TContext, next: Next) => {
        if(ctx.kind === ContextKind.Timer) {
            return middleware(ctx as unknown as OnlyTimer<TContext>, next);
        } else {
            return next();
        }
    };
}
