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
import { compose } from './compose';
import { once } from './utilities/once';

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
     * Composed middlware.
     */
    #composed: Middleware<TContext>|null = null;

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

    /**
     * Invoke middleware in order.
     * @param context The context for this request.
     * @param mw List of middleware to invoke.
     */
    async #invokeMiddleware(context: TContext, ...mw: Middleware<TContext>[]): Promise<unknown> {
        const composed = compose(mw);
        const next = () => Promise.resolve();
        return composed(context, next);
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
            const endpointMiddleware:Middleware<TContext> = async (context:TContext, next:Next) => {
                // TODO: Build endpoint middleware once and pass endpoint into it so that middleware can be 
                // composed a single time.
                const optionalNext = once(next);
                const restrictContext = <RestrictContext<TContext, TBody, TStatus, THeaders>>context;
                await fn(restrictContext, optionalNext);
                await optionalNext();
            };
            await this.#invokeMiddleware(
                context,
                ...this.#middleware,
                endpointMiddleware,
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
            if(!contentType) {
                contentType = 'plain/text';
            }
            azureContext.res.status = status;
            azureContext.res.headers[HeaderNames.ContentType] = contentType;
        };
    }
}
