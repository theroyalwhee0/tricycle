import { Context } from "./context"
import { Middleware, Next } from "./middleware"

// REF: https://github.com/koajs/compose

export function compose<TContext extends Context>(mw:Middleware<TContext>[]):Middleware<TContext>{
    async function composed(ctx: TContext, next: Next):Promise<unknown> {
        let lastIdx = -1;
        async function composeMiddleware(idx:number):Promise<unknown> {
            if (lastIdx > idx) {
                throw new Error(`next() called multiple times (${lastIdx})`);
            }
            lastIdx = idx;
            let middleware:Middleware<TContext>;
            if(idx < mw.length) {
                middleware = mw[idx];
            } else if(idx === mw.length) {
                middleware = next;
            } else {
                return;
            }
            const nextMiddleware:Next = composeMiddleware.bind(null, idx+1);
            return middleware(ctx, nextMiddleware);
        }
        return composeMiddleware(0);
    }
    return composed;
}
