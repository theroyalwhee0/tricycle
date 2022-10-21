import { spy } from 'sinon';
import { Next, Tricycle } from '../../src';
import { Context, ContextKind } from '../../src/context';
import { mockAzureContext, MockAzureContextOptions } from './azure';

/**
 * Mock symbol.
 */
export const Mock = Symbol('Mock');

/**
 * Mock Next.
 */
export const mockNext = ():Next => spy();

/**
 * Mock Context Optins
 */
export type MockContextOptions = { 
    azureContext?:MockAzureContextOptions 
};

/**
 * Mock context with platform.
 */
export function mockPlatformContext<TContext extends Context>(options?:MockContextOptions):TContext {
    const ctx:TContext = {
        app: null as unknown as Tricycle<TContext>, // TODO: Mock app.
        kind: ContextKind.Unknown,
        platform: {
            azureContext: mockAzureContext(options?.azureContext),
        },
    } as unknown as TContext;
    return ctx;
}
