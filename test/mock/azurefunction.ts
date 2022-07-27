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

    constructor() {
        this.invocationId = 'test';
        this.bindingDefinitions = [];
        this.req = new MockAzureHttpRequest();
        this.res = {
            headers: {},
            body: undefined,
        };
    }
}

export class MockAzureHttpRequest implements HttpRequest {
    method: HttpMethod;
    url: string;
    headers: HttpRequestHeaders;
    query: HttpRequestQuery;
    params: HttpRequestParams;
    user: HttpRequestUser;
    body?: unknown;
    rawBody?: unknown;
    parseFormBody(): Form {
        throw new Error('Method not implemented.');
    }

    constructor() {
        this.method = 'GET';
        this.url = '/birdseed';
        this.headers = {};
        this.query = {};
        this.params = {};
    }
}

export type MockCallFuncResults = {
    context: Context,
    request: HttpRequest
    response: { [key: string]: unknown; }
};

export async function mockCallFunc(func: AzureFunction): Promise<MockCallFuncResults> {
    // NOTE: This is calling the Azure Function, this context is the Azure Context,
    // and the request is the Azure Request.
    const context = new MockAzureContext();
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
