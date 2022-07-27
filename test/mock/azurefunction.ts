import {
    HttpRequest, Context, BindingDefinition,
    ContextBindingData, ContextBindings, ExecutionContext,
    Logger, TraceContext, Form,
    HttpMethod, HttpRequestHeaders, HttpRequestParams,
    HttpRequestQuery, HttpRequestUser, AzureFunction
} from '@azure/functions';

export class MockAzureContext implements Context {
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
    res: { [key: string]: unknown; };

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
        this.res = {
            headers: {},
            body: undefined,
        };
    }
}
export type MockAzureHttpRequestOptions = {
    params?: Record<string, string>
    query?: Record<string, string>
    headers?: Record<string, string>
}

export class MockAzureHttpRequest implements HttpRequest {
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
    }
}

export type MockCallFuncResults = {
    context: Context,
    request: HttpRequest
    response: { [key: string]: unknown; }
};

export type MockAzureContextOptions = {
    invocationId?: string
    bindingData?: Partial<ContextBindingData>
    req?: MockAzureHttpRequestOptions
}

export async function mockCallFunc(func: AzureFunction, options: MockAzureContextOptions = {}): Promise<MockCallFuncResults> {
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
