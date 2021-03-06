import {
    HttpRequest, Context, BindingDefinition,
    ContextBindingData, ContextBindings, ExecutionContext,
    Logger, TraceContext, Form,
    HttpMethod, HttpRequestHeaders, HttpRequestParams,
    HttpRequestQuery, HttpRequestUser, AzureFunction, HttpResponse, HttpResponseSimple, HttpResponseHeaders, Cookie
} from '@azure/functions';
import { isArray, isObject } from '@theroyalwhee0/istype';
import { Mock } from './mock';

export class MockAzureContext implements Context {
    [Mock] = true;
    invocationId: string;
    executionContext: ExecutionContext;
    bindings: ContextBindings;
    bindingData: ContextBindingData;
    traceContext: TraceContext;
    bindingDefinitions: BindingDefinition[];
    log: Logger;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done(_err?: string | Error, _result?: unknown): void {
        throw new Error('Method not implemented.');
    }
    req: HttpRequest;
    res: HttpResponse;

    constructor(options: MockAzureContextOptions = {}) {
        if (options.invocationId) {
            this.invocationId = options.invocationId;
        }
        this.bindingData = {
            invocationId: this.invocationId,
            ...options.bindingData,
        };
        this.bindingDefinitions = [];
        this.req = new MockAzureHttpRequest(options.req);
        this.res = new MockAzureHttpResponse();
    }
}
export type MockAzureHttpRequestOptions = {
    params?: Record<string, string>
    query?: Record<string, string>
    headers?: Record<string, string>
    body?: unknown
    rawBody?: string
}

export class MockAzureHttpResponse implements HttpResponseSimple {
    [Mock]: true;
    headers?: HttpResponseHeaders = {};
    cookies?: Cookie[] = [];
    body?: unknown;
    statusCode?: number | string = 200;
    enableContentNegotiation?: boolean = false;
}

export class MockAzureHttpRequest implements HttpRequest {
    [Mock] = true;
    url = '/birdseed'
    method: HttpMethod = 'GET'
    headers: HttpRequestHeaders = {}
    query: HttpRequestQuery = {}
    params: HttpRequestParams = {}
    user: HttpRequestUser
    body?: unknown;
    rawBody?: unknown;

    parseFormBody(): Form {
        throw new Error('Method not implemented.');
    }

    constructor(options: MockAzureHttpRequestOptions = {}) {
        if (options.headers) {
            this.headers = { ...options.headers };
        }
        if (options.query) {
            this.query = { ...options.query };
        }
        if (options.params) {
            this.params = { ...options.params };
        }
        if (options.rawBody !== undefined) {
            this.rawBody = options.rawBody;
        }
        if (options.body !== undefined) {
            if (isObject(options.body)) {
                this.body = { ...options.body };
            } else if (isArray(options.body)) {
                this.body = [...options.body];
            } else {
                this.body = options.body;
            }
            if (this.rawBody === undefined) {
                this.rawBody = JSON.stringify(this.body);
            }
        }
    }
}

export type MockCallFuncResults = {
    context: Context,
    request: HttpRequest
    response: HttpResponse
};

export type MockAzureContextOptions = {
    invocationId?: string
    bindingData?: Partial<ContextBindingData>
    req?: MockAzureHttpRequestOptions
}

export async function mockCallFunc(func: AzureFunction, options: MockAzureContextOptions = {}): Promise<MockCallFuncResults> {
    // NOTE: This is calling the Azure Function, this context is the Azure Context,
    // and the request is the Azure Request.
    const context = new MockAzureContext(options);
    const request = context.req;
    const results = await func(context, request);
    if (results !== undefined) {
        throw new Error(`Expected func results to be undefined.`);
    }
    const response = context.res;
    return {
        context,
        request,
        response
    };
}
