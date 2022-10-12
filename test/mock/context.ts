import { Context, Tricycle } from '../../src';
import { HttpContext } from '../../src/http/context';
import { mockAzureContext, MockAzureContextOptions } from './azure';

export type MockContextOptions = {
    azureContextOptions?: MockAzureContextOptions
}

export function mockContext<TContext extends Context=Context>(
    _tricycle:Tricycle,
):TContext {
    throw new Error('Function not implemented.');
}

export function mockHttpContext<TContext extends HttpContext=HttpContext>(
    tricycle:Tricycle, options?:MockContextOptions
):TContext {
    const azureContext = mockAzureContext(options?.azureContextOptions);
    const context = new HttpContext(tricycle, azureContext) as TContext;
    return context;
}
