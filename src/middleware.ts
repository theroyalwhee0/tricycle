import { Context } from "./context";

export type Next = () => Promise<void>;
export type Middleware<TContext extends Context = Context> =
    ((ctx?: TContext, next?: Next) => Promise<void>) |
    ((ctx?: TContext, next?: Next) => void)
    ;
