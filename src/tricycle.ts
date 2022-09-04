import {
    AzureFunction,
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
import { isArray, isInteger, isObject, isString, isBoolean } from '@theroyalwhee0/istype';
import { DetailedError } from './utilities/error';
import { HttpStatus, HTTP_STATUS_MIN, HTTP_STATUS_MAX } from './status';
import { JsonValue } from './utilities/json';
import { None, NoneType } from './utilities/none';
import { HeaderNames, Headers } from './headers';
import { Context, RestrictContext } from './context';
import { Middleware, Next } from './middleware';
import { ResponseBody } from './response';
import { HttpMessage } from './httpmsg';
import { MimeTypes } from './mimetypes';

/**
 * Clone callback type.
 */
export type CloneCallback<TContext extends Context> = (tricycle: Tricycle<TContext>) => void;

/**
 * The main Tricycle application class.
 */
export class Tricycle<TContext extends Context = Context> {

    /**
     * Middleware list.
     */
    readonly #middleware: Middleware<TContext>[] = [];

    /**
     * Create a new Tricycle instance.
     * @param from Create new instance by cloning existing instance.
     */
    constructor(from?: Tricycle<TContext>) {
        if (isObject(from)) {
            this.#middleware = from.#middleware.concat();
        }
    }

    /**
     * Attach a middleware function.
     * @param middlware The middleware to attach.
     * @returns A cloned instance of Tricycle.
     */
    use(middlware: Middleware<TContext>) {
        return this.clone((copy) => {
            copy.#middleware.push(middlware);
        });
    }

    /**
     * Clone an instance of Tricycle.
     * @param callback A callback to call after clone.
     * @returns The cloned instance.
     */
    clone(callback?: CloneCallback<TContext>): Tricycle<TContext> {
        const instance = new Tricycle<TContext>(this);
        if (callback) {
            callback(instance);
        }
        return instance;
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

    /**
     * Create a Azure HTTP endpoint.
     * @param fn The endpoint function.
     * @returns An AzureFunction HTTP endpoint.
     */
    endpoint<
        TBody extends ResponseBody = JsonValue,
        TStatus extends number = number,
        THeaders extends Headers = Headers,
        >(
            fn: Middleware<RestrictContext<TContext, TBody, TStatus, THeaders>>
        ): AzureFunction {
        return async (azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) => {
            const context = Context.create<TContext>(this, azureContext, azureRequest);
            await this.#invokeMiddleware(
                context,
                ...this.#middleware,
                <Middleware<TContext>><unknown>fn
            );
            const headers: Headers = context.response.headers;
            let status: number | NoneType = context.response.status;
            let body: ResponseBody | NoneType = context.response.body;

            Object.assign(azureContext.res.headers, headers);
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
            }
            let contentType = headers[HeaderNames.ContentType];
            if (body !== None) {
                // Default status/content type from body.
                if (body === null) {
                    // If null and status is not set and content-type not set, set status to no-content.
                    if (!contentType && status === None) {
                        status = HttpStatus.NO_CONTENT;
                    }
                } else if (isString(body)) {
                    // If string and content-type not set, set to application/json.
                    if (!contentType) {
                        contentType = MimeTypes.TextPlain;
                    }
                } else if (isArray(body) || isObject(body) || isBoolean(body)) {
                    // If Array, Object, or Boolean and content-type not set, set to application/json.
                    if (!contentType) {
                        contentType = MimeTypes.ApplicationJson;
                    }
                }
                azureContext.res.body = body;
            }
            if(status === None) {
                status = 200;
            }            
            azureContext.res.status = status;
            azureContext.res.headers[HeaderNames.ContentType] = contentType || 'plain/text';
        };
    }
}
