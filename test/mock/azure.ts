import {
    BindingDefinition, Context as AzureContext, ContextBindingData,
    ContextBindings, Cookie, ExecutionContext, Form, HttpMethod, HttpRequest,
    HttpRequestHeaders, HttpRequestParams, HttpRequestQuery, HttpRequestUser,
    HttpResponse, HttpResponseHeaders, HttpResponseSimple, Logger, TraceContext,
} from '@azure/functions';
import { Mock } from '../mock';

/**
 * Mock AzureContext Optins
 */
export type MockAzureContextOptions = {
    invocationId?: string
};

/**
 * Mock Azure HTTP Response.
 */
export class MockAzureHttpResponse implements HttpResponseSimple {
    [Mock]: true;
    headers?: HttpResponseHeaders = {};
    cookies?: Cookie[] = [];
    statusCode?: number | string = 200;
    enableContentNegotiation?: boolean = false;
    body?: unknown;

    constructor(_options?: MockAzureContextOptions) {
        // Empty.
    }
}

/**
 * Default mock headers.
 */
const defaultHeaders = {
    'X-Forwarded-For': '203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348, 10.9.8.7',
};

/**
 * Mock Azure HTTP Request.
 */
export class MockAzureHttpRequest implements HttpRequest {
    [Mock]: true;
    method: HttpMethod | null = 'GET';
    url = 'https://localhost:9090/registration?campaign=summerfest';
    headers: HttpRequestHeaders = {};
    query: HttpRequestQuery = {};
    params: HttpRequestParams = {};
    user: HttpRequestUser | null = null;
    body?: unknown;
    rawBody?: unknown;

    constructor(_options?: MockAzureContextOptions) {
        this.headers = Object.assign(this.headers, defaultHeaders);
    }

    parseFormBody(): Form {
        throw new Error('Method not implemented.');
    }
}

/**
 * Mock AzureContext.
 */
export class MockAzureContext implements AzureContext {
    [Mock]: true;
    invocationId = '';
    executionContext: ExecutionContext;
    bindings: ContextBindings;
    bindingData: ContextBindingData;
    traceContext: TraceContext;
    bindingDefinitions: BindingDefinition[] = [];
    log: Logger;
    req: HttpRequest;
    res: HttpResponse;

    constructor(options?: MockAzureContextOptions) {
        if (options?.invocationId) {
            this.invocationId = options.invocationId;
        }
        if (this.invocationId) {
            this.bindingData = {
                invocationId: this.invocationId,
            };
        }
        this.req = new MockAzureHttpRequest(options);
        this.res = new MockAzureHttpResponse(options);
    }

    done(_err?: string | Error, _result?: unknown): void {
        throw new Error('Method not implemented.');
    }
}

/**
 * Mock AzureContext.
 */
export function mockAzureContext(options?: MockAzureContextOptions): AzureContext {
    return new MockAzureContext(options);
}
