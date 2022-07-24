import {
    AzureFunction,
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
import { isInteger, isObject } from '@theroyalwhee0/istype';
import { DetailedError } from './utilities/error';
import { HttpStatus, HTTP_STATUS_MIN, HTTP_STATUS_MAX } from './httpstatus';
import { JsonObject, JsonValue } from './utilities/json';
import { None, NoneType } from './utilities/none';
import { Headers } from './headers';
import { Context, IContext } from './context';
import { Middleware, Next } from './middleware';
import { ResponseBody } from './response';

type CloneFunction<TContext extends Context> = (tricycle: Tricycle<TContext>) => void;


export class Tricycle<TContext extends Context = Context> {

    readonly #middleware: Middleware<TContext>[] = [];

    constructor(from?: Tricycle<TContext>) {
        if (isObject(from)) {
            this.#middleware = from.#middleware.concat();
        }
    }

    middleware(mw: Middleware<TContext>) {
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
        const context: TContext = new Context() as TContext;
        context.request.url = azureRequest.url;
        context.request.method = <string>azureRequest.method;
        context.platform.azureContext = azureContext;
        context.platform.azureRequest = azureRequest;
        return context;
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
        TStatus extends HttpStatus = HttpStatus,
        THeaders extends Headers = Headers,
        >(
            fn: Middleware<RestrictContext<TContext, TBody, TStatus, THeaders>>
        ): AzureFunction {
        const azureEndpoint = async (azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) => {
            const context = this.#createContext(azureContext, azureRequest);
            await this.#invokeMiddleware(context, ...this.#middleware, <Middleware<UnrestrictContext<TContext>>>fn);
            let status: HttpStatus | NoneType = None;
            let body: JsonValue | NoneType = None;
            // let contentType: string | NoneType = None;
            let headers: Headers | NoneType = None;

            // enum HeaderNames {
            //     ContentType = 'content-type'
            // }

            enum HttpMessage {
                NOT_FOUND = 'Not Found'
            }

            // contentType = context.response.get(HeaderNames.ContentType) ?? None;
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

/**
 * A context with more restricted types.
 */
//  TBody extends ResponseBody = JsonObject,

type RestrictContext<
    TContext extends IContext,
    TBody extends IContext['response']['body'],
    TStatus extends IContext['response']['status'],
    THeaders extends IContext['response']['headers'],
    > =
    Omit<TContext, 'body' | 'status' | 'response'> & {
        body: TBody,
        status: TStatus,
        response: Omit<TContext['response'], 'body' | 'status' | 'headers'> & {
            body: TBody,
            status: TStatus,
            headers: THeaders,
        }
    };

/**
 * Remove the restructions on a restricted context.
 */
type UnrestrictContext<TContext extends Context> =
    Omit<TContext, 'body'> & {
        body: TContext['body']
    };
