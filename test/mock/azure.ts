import {
    BindingDefinition, Context as AzureContext, ContextBindingData,
    ContextBindings, Cookie, ExecutionContext, Form, HttpMethod, HttpRequest,
    HttpRequestHeaders, HttpRequestParams, HttpRequestQuery, HttpRequestUser,
    HttpResponse, HttpResponseHeaders, HttpResponseSimple, Logger, TraceContext,
} from '@azure/functions';
import { spy } from 'sinon';
import { Mock } from '../mock';

/**
 * Mock AzureContext Optins
 */
export type MockAzureContextOptions = {
    invocationId?: string
};

/**
 * Azure Logger function signature.
 */
type LoggerFn = (...args: unknown[]) => void;

/**
 * Symbol for referencing ALL logger spy.
 */
export const ALL = Symbol('ALL');

/**
 * Mock Azure Logger.
 * @returns A mock Azure Logger.
 */
export function mockAzureLogger(): Logger {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const all: LoggerFn = spy((..._args: unknown[]): void => {
        return;
    });
    const logger: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const error: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const warn: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const info: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });
    const verbose: LoggerFn = spy((...args: unknown[]) => {
        return all(...args);
    });

    // UNSAFE CODE - START
    const azureLogger: Logger = logger as Logger;
    Object.assign(azureLogger, {
        error, warn, info, verbose,
        [ALL]: all,
    });
    // UNSAFE CODE - END

    return azureLogger;
}

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

    get status():number {
        throw new Error('Use .statusCode instead.');
    }

    set status(value:number) {
        throw new Error('Use .statusCode instead.');
    }    

    constructor(_options?: MockAzureContextOptions) {
        // Empty.
    }
}

/**
 * Default mock request headers.
 */
const defaultRequestHeaders = {
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
        this.headers = Object.assign(this.headers, defaultRequestHeaders);
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
        this.log = mockAzureLogger();
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
