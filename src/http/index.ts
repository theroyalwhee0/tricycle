import { RemovableContextProperties } from '../context';
import { RestrictContext } from '../context/restrict';
import { RequiredKeys } from '../utilities/types';
import { HttpContext } from './context';
import { ResponseBody } from './response';

export type IEndpoint = {
    request?: IEndpointRequest,
    response?: IEndpointResponse,
};

export interface IEndpointRequest {
    params?: Record<string, string>,
    query?: Record<string, string>,
}

export interface IEndpointResponse {
    headers?: Record<string, string>,
    status?: number,
    body?: ResponseBody,
}

export type Endpoint<TEndpoint extends IEndpoint> = (
    TEndpoint
);

export type ContextEndpoint = {
    request: ContextRequest,
    response: ContextResponse,
};

export type ContextRequest = Required<IEndpointRequest>;
export type ContextResponse = Required<IEndpointResponse>;

export type HttpConcerns = {
    'response': EndpointResponseHideUnused,
    'request': EndpointRequestHideUnused,
};

export type EndpointRequire = keyof HttpConcerns;
export type EndpointExclude = Exclude<RemovableContextProperties, EndpointRequire>;

export type EndpointRequestHideUnused = keyof ContextRequest;
export type EndpointResponseHideUnused = keyof ContextResponse;

export type HttpFunction<TContext extends HttpContext, TEndpoint extends IEndpoint> = Awaited<
    (ctx: (
        Omit<(
            RequiredKeys<(
                RestrictContext<TContext, TEndpoint, HttpConcerns>
            ), EndpointRequire>
        ), EndpointExclude>
    )) => void
>;
