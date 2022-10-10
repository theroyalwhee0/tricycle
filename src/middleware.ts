import { Context } from "./context";

/**
 * Call next middleware in sequence.
 */
export type Next = () => Promise<unknown>;

/**
 * Middleware function.
 */
export type Middleware<TContext extends Context> = Awaited<((ctx: TContext, next: Next) => void)>;

/**
 * Tricycle function. A next-less middleware.
 */
 export type TricycleFunction<TContext extends Context=Context> = Awaited<((ctx: TContext) => void)>;
