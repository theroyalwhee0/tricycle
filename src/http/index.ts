/* eslint-disable @typescript-eslint/ban-types */
import { Context } from '../context';
import { OnlyHttp } from '../context/restrict';
import { HttpContext, IHttpContext } from './context';
import { HttpRequest, IHttpRequest } from './request';
import { HttpResponse, ResponseBody } from './response';

export interface IEndpointRequest {
    params?: Record<string, string>,
    query?: Record<string, string>,
}

export interface IEndpointResponse {
    status?: number,
    body?: ResponseBody,
}

export type IEndpoint = {
    response?: unknown,
    request?: unknown,
}

export type OverridePropertyFromEndpoint<
    TContext extends IHttpContext,
    TEndpoint extends IEndpoint,
    TKey extends keyof TContext & keyof TEndpoint,
    TStrictlyOptional extends keyof Exclude<TContext[TKey], undefined>,
> = (
    // Override Context properties to match ones given in endpoint.
    Omit<TContext, TKey> & {
        // For each key in overrides...
        [Key in TKey]: {
            [
                // For each key in TContext[TKey] or TEndpoint[TKey]...
                Prop in keyof Exclude<TContext[TKey] & TEndpoint[TKey], undefined> 
            ]: (
                Prop extends Extract<keyof TEndpoint[TKey], keyof Exclude<TContext[TKey], undefined>> ? (
                    // If prop is in TEndpoint[TKey] and TContext[TKey], include from TEndpoint[TKey]...
                    TEndpoint[TKey][Prop]
                ) : Prop extends keyof Exclude<TContext[TKey], undefined> ? (
                    // If prop is in TContext[TKey]...
                    Prop extends TStrictlyOptional ? (
                        // If prop is in strictly optional...
                        never
                    ) : (
                        // Else include from TContext[TKey]
                        Exclude<TContext[TKey], undefined>[Prop]
                    )
                ) : (
                    // Else the propery should have been excluded earier in the chain, use never...
                    never
                )
            )
        }
    }
);

export type OverrideFromEndpoint<
    TContext extends IHttpContext,
    TEndpoint extends IEndpoint,
> = (
    OverridePropertyFromEndpoint<TContext, TEndpoint, 'request', 'query'|'params'>
);

export type HttpFunction<TContext extends HttpContext, TEndpoint extends IEndpoint> = Awaited<
    // Override the Context with properties from TEndpoint.
    // This makes a guaranteed that the function will get HTTP Contexts.
    (ctx: OverrideFromEndpoint<OnlyHttp<TContext>, TEndpoint>) => void
>;

export type ExactlyOverrides<TTarget, TSource, TMessage extends string> = 
    // Ensure TTarget exactly overrides TSource, otherwise use TMessage string as type.
    // This is used to get better type error messages.
    Exclude<keyof TTarget, keyof TSource> extends never ? (TTarget) : (TMessage)
;

export type PropertyOrMessage<TProp extends string, TRequest> =
    // Build an object with a TProp property and a TRequest value or use TRequest if it is a string.
    // This is used to get better type error messages.
    TRequest extends string ? TRequest : {
        [_ in TProp]: TRequest
    }
;

export type Endpoint<TRequest extends IEndpointRequest|undefined=undefined, _TResponse extends IEndpointResponse=never> =
    // Make an endpoint type used to override Context properties.
    EndpointRequest<TRequest>
;

export type EndpointRequest<TRequest extends IEndpointRequest|undefined> =
    // Make a type that only allow exact override of IEndpointRequest type.
    (TRequest extends undefined
        ? { }
        : PropertyOrMessage<
            'request',
            ExactlyOverrides<TRequest, IEndpointRequest, 'Endpoint Request must be exactly of type IEndpointRequest'>
        >
    )
;


// REF: https://stackoverflow.com/a/61625831
// export type IsStrictlyAny<T> = (T extends never ? true : false) extends false ? false : true;
