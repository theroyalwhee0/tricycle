import { Context } from "./context";

export type Next = () => Promise<unknown>;
export type Middleware<TContext extends Context = Context> =
    ((ctx: TContext, next: Next) => Promise<unknown>) |
    ((ctx: TContext, next: Next) => unknown)
    ;
