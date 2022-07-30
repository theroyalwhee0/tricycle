import { Middleware, Headers } from '@tricycle/tricycle';

export function addHeaders(...headers: Headers[]): Middleware {
    return async function addHeadersMiddlware(ctx) {
        Object.assign(ctx.response.headers, ...headers);
    };
}

export default addHeaders;
