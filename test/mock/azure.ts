import {
    BindingDefinition,
    Context as AzureContext, ContextBindingData, ContextBindings, ExecutionContext, HttpRequest, HttpResponse, Logger, TraceContext,
} from '@azure/functions';


/**
 * Mock AzureContext Optins
 */
export type MockAzureContextOptions = {
    invocationId?: string    
};

/**
 * Mock AzureContext.
 */
export class MockAzureContext implements AzureContext {
    invocationId: string;
    executionContext: ExecutionContext;
    bindings: ContextBindings;
    bindingData: ContextBindingData;
    traceContext: TraceContext;
    bindingDefinitions: BindingDefinition[] = []
    log: Logger;
    req: HttpRequest;
    res: HttpResponse;

    constructor(options?: MockAzureContextOptions) {
        if (options?.invocationId) {
            this.invocationId = options.invocationId;
        }
        if(this.invocationId) {
            this.bindingData = {
                invocationId: this.invocationId,
            };
        }
    }

    done(_err?: string | Error, _result?: unknown): void {
        throw new Error('Method not implemented.');
    }    
}

/**
 * Mock AzureContext.
 */
export function mockAzureContext(options?: MockAzureContextOptions): AzureContext {
    return new MockAzureContext();
}
