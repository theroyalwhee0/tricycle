import {
    AzureFunction,
    Context as AzureContext,
    HttpRequest as AzureHttpRequest
} from '@azure/functions';
import { isInteger, isObject } from '@theroyalwhee0/istype';
import { DetailedError } from './utilities/error';
import { HttpStatus, HTTP_STATUS_MIN, HTTP_STATUS_MAX } from './httpstatus';
import { JsonValue } from './utilities/json';
import { None, NoneType } from './utilities/none';
import { Headers } from './headers';
import { Context } from './context';
import { Middleware, Next } from './middleware';

type CloneFunction<TContext extends Context> = (tricycle: Tricycle<TContext>) => void;


export class Tricycle<TContext extends Context = Context> {

    readonly #middleware: Middleware<TContext>[] = [];

    constructor(from?: Tricycle<TContext>) {
        if (isObject(from)) {
            this.#middleware = from.#middleware.concat();
        }
    }

    middlware(mw: Middleware<TContext>) {
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


    #applyMiddleware(context: TContext, next: Next): Promise<void>[] {
        const middlware = [];
        for (const mw of this.#middleware) {
            const pm = mw(context, next);
            if (pm instanceof Promise) {
                // Sync middleware can be skipped.
                middlware.push(pm)
            }
        }
        return middlware;
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

    endpoint(fn: Middleware<TContext>): AzureFunction {
        const azureEndpoint = async (azureContext: Readonly<AzureContext>, azureRequest: Readonly<AzureHttpRequest>) => {
            const context = this.#createContext(azureContext, azureRequest);
            const [next, resolveNext] = this.#nextFactory();
            const middleware = this.#applyMiddleware(context, next);
            const handlerPromise = fn(context, next);
            resolveNext();
            await handlerPromise;
            await Promise.all(middleware);
            let status: HttpStatus | NoneType = None;
            let body: JsonValue | NoneType = None;
            let contentType: string | NoneType = None;
            let headers: Headers | NoneType = None;

            enum HeaderNames {
                ContentType = 'content-type'
            }

            enum HttpMessage {
                NOT_FOUND = 'Not Found'
            }

            contentType = context.response.get(HeaderNames.ContentType) ?? None;
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
