import {
    AzureFunction,
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
import { isInteger, isObject } from '@theroyalwhee0/istype';
import { DetailedError } from './utilities/error';
import { HttpStatus, HTTP_STATUS_MIN, HTTP_STATUS_MAX } from './status';
import { JsonObject, JsonValue } from './utilities/json';
import { None, NoneType } from './utilities/none';
import { CaseInsensitiveHeaders, HeaderNames, Headers } from './headers';
import { Context, RestrictContext } from './context';
import { Middleware, Next } from './middleware';
import { ResponseBody } from './response';
import { HttpMessage } from './httpmsg';

type AzureHttpRequestEx = AzureHttpRequest & {
    // Add optional originalUrl to HttpRequest.
    // REF: https://github.com/Azure/azure-functions-nodejs-worker/issues/589
    originalUrl?: string
};

type CloneFunction<TContext extends Context> = (tricycle: Tricycle<TContext>) => void;

export class Tricycle<TContext extends Context = Context> {

    readonly #middleware: Middleware<TContext>[] = [];

    constructor(from?: Tricycle<TContext>) {
        if (isObject(from)) {
            this.#middleware = from.#middleware.concat();
        }
    }

    use(mw: Middleware<TContext>) {
        return this.clone((copy) => {
            copy.#middleware.push(mw);
        });
    }

    clone(fn?: CloneFunction<TContext>): Tricycle<TContext> {
        const copy = new Tricycle<TContext>(this);
        if (fn) {
            fn(copy);
        }
        return copy;
    }

    #createContext(azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>): TContext {
        // NOTE: To prevent allocations some items are references to the original data, not copies.
        const ctx: TContext = new Context(this) as TContext;
        // Request.
        const url = azureRequest.url;
        const originalUrl = (<AzureHttpRequestEx>azureRequest).originalUrl ?? '';
        const requestHeaders = new CaseInsensitiveHeaders(azureRequest.headers);
        const contentType = requestHeaders[HeaderNames.ContentType] ?? '';
        ctx.request.method = azureRequest.method;
        ctx.request.url = url;
        ctx.request.originalUrl = originalUrl || url;
        ctx.request.body = azureRequest.body;
        ctx.request.rawBody = azureRequest.rawBody;
        ctx.request.params = azureContext.req.params;
        ctx.request.headers = requestHeaders;
        ctx.request.type = contentType;
        // Platform.
        ctx.platform.azureContext = azureContext;
        ctx.platform.azureRequest = azureRequest;
        return ctx;
    }

    #nextFactory(): [Next, () => void] {
        let resolveNext;
        const nextPromise = new Promise<void>((resolve) => {
            resolveNext = () => {
                resolve();
            }
        });
        const next: Next = (): Promise<void> => {
            return nextPromise;
        };
        return [next, resolveNext];
    }

    async #invokeMiddleware(context: TContext, ...mw: Middleware<TContext>[]): Promise<void> {
        type Resolver = () => void;
        const resolvers: Resolver[] = [];
        const waiters: Promise<void>[] = [];
        for (const middleware of mw) {
            // Call middleware in order.
            const [next, resolveNext] = this.#nextFactory();
            const middlewarePromise = middleware(context, next)
            // Middleware may be sync and not return a promise.
            if (middlewarePromise) {
                resolvers.push(resolveNext);
                waiters.push(middlewarePromise);
            }
        }
        for (let idx = waiters.length - 1; idx >= 0; idx--) {
            // Resolve each middleware in reverse order.
            const resolveNext = resolvers[idx];
            const middlewarePromise = waiters[idx];
            resolveNext();
            await middlewarePromise;
        }
    }

    endpoint<
        TBody extends ResponseBody = JsonObject,
        TStatus extends number = number,
        THeaders extends Headers = Headers,
        >(
            fn: Middleware<RestrictContext<TContext, TBody, TStatus, THeaders>>
        ): AzureFunction {
        const azureEndpoint = async (azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) => {
            const context = this.#createContext(azureContext, azureRequest);
            await this.#invokeMiddleware(
                context,
                ...this.#middleware,
                <Middleware<TContext>><unknown>fn
            );
            let status: number | NoneType = None;
            let body: JsonValue | NoneType = None;
            let headers: Headers | NoneType = None;

            status = context.response.status;
            body = context.response.body;
            headers = context.response.headers;

            if (body === None && status === None) {
                status = HttpStatus.NOT_FOUND
                body = HttpMessage.NOT_FOUND;
            }
            if (status !== None) {
                if (
                    (!isInteger(status)) ||
                    status < HTTP_STATUS_MIN ||
                    status > HTTP_STATUS_MAX
                ) {
                    throw new DetailedError(`"${status}" is not a valid HTTP status.`);
                }
                azureContext.res.status = status;
            }
            Object.assign(azureContext.res.headers, headers);
            if (body !== None) {
                azureContext.res.body = body;
            }
        }
        return azureEndpoint;
    }
}
