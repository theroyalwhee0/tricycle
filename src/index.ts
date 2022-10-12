/**
 * Tricycle.
 */
export { Tricycle, TricycleContext } from './app';

/**
 * HTTP Statuses.
 */
export * as HttpStatus from './http/httpstatus';

/**
 * HTTP Headers.
 */
export { Headers, HeaderNames } from './http/headers';

/**
 * Middleware.
 */
export { Middleware, Next } from './middleware';

/**
 * Context.
 */
export { Context, ContextKind } from './context';



// const app = new Tricycle()
//     .use(httpMiddleware((ctx) => {
//         console.log("HTTP only", !!ctx.req);
//     }))
//     .use(timerMiddleware((ctx) => {
//         console.log("Timer only", !!ctx.timer);
//     }));

// const _ep = app.endpoint((ctx) => {
//     console.log("@@ endpoint", ctx.res);
// });

// const _tm = app.timer((ctx) => {
//     console.log("@@ timer");
//     console.log("@@ endpoint", ctx.timer);
// });
