import { Middleware, Headers } from '@tricycle/tricycle';


export function addHeaders(headers: Headers): Middleware {
    return async function addHeadersMiddlware(ctx, next) {
        Object.assign(ctx.response.headers, headers);
        await next();
    };
}

export default addHeaders;
