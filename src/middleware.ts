import { Context } from "./context";

/**
 * Call next middleware in sequence.
 */
export type Next = () => Promise<unknown>;

/**
 * Middleware function.
 */
export type Middleware<TContext extends Context> = Awaited<((ctx: TContext, next: Next) => unknown)>;
