import { Context } from "./context"
import { Middleware, Next } from "./middleware"

/**
 * Compose middleware functions into a single middleware function.
 * Dealing with kinds of middleware is not a concern here.
 * REF: https://github.com/koajs/compose
 * @param middleware The middlware to compose.
 * @returns The resulting middleare function.
 */
export function compose<TContext extends Context>(middleware:Middleware<TContext>[]):Middleware<TContext> {
    async function composed(ctx: TContext, next: Next):Promise<void> {
        let lastIdx = -1;
        async function composeMiddleware(idx:number):Promise<void> {
            if (lastIdx > idx) {
                throw new Error(`next() called multiple times (${lastIdx})`);
            }
            lastIdx = idx;
            let mw:Middleware<TContext>;
            if(idx < middleware.length) {
                mw = middleware[idx];
            } else if(idx === middleware.length) {
                mw = next;
            } else {
                return;
            }
            const nextMiddleware:Next = composeMiddleware.bind(null, idx+1);
            return mw(ctx, nextMiddleware);
        }
        return composeMiddleware(0);
    }
    return composed;
}
