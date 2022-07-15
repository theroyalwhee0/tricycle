import { describe, it } from 'mocha';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { AzureFunction } from '@azure/functions';
import { Tricycle } from '../src/tricycle';
import { Context } from '../src/context';
import { Middleware } from '../src/middleware';
import { mockCallFunc } from './mock/azurefunction';

describe('Tricycle', () => {
    it('should be a class', () => {
        expect(Tricycle).to.be.a('function');
    });
    it('should be instanceable', () => {
        const tricycle = new Tricycle();
        expect(tricycle).to.be.instanceOf(Tricycle);
    });
    it('should be clonable', () => {
        const tricycle = new Tricycle();
        const clone = tricycle.clone();
        expect(clone).to.be.instanceOf(Tricycle);
    });
    it('should build callable endpoint', async () => {
        const tricycle = new Tricycle();
        type TestBody = Record<string, boolean>;
        const endpoint: Middleware<Context> = spy((context: Context) => {
            expect(context).to.be.an('object');
            context.body = <TestBody>{ ok: true };
        });
        const endpointSpy: SinonSpy = <SinonSpy>endpoint;
        const func: AzureFunction = tricycle.endpoint(endpoint);
        expect(func).to.be.a('function');
        expect((endpointSpy).callCount).to.equal(0);
        const results = await mockCallFunc(func);
        expect((endpointSpy).callCount).to.equal(1);
        expect(results.response.body).to.be.an('object');
        expect((<TestBody>results.response.body).ok).to.equal(true);
    });
    it('should build callable middlware', async () => {
        const tricycle = new Tricycle();
        type TestBody = Record<string, boolean | number>;
        interface TestMiddlewareContext extends Context {
            index: number
        }
        type TestContext = TestMiddlewareContext;
        const middleware: Middleware<TestMiddlewareContext> = spy((context: TestMiddlewareContext) => {
            context.index = (context.index ?? 0) + 1;
        });
        const endpoint: Middleware<TestContext> = spy((context: TestContext) => {
            expect(context).to.be.an('object');
            context.body = <TestBody>{
                ok: true,
                index: context.index
            };
        });
        const middlewareSpy: SinonSpy = <SinonSpy>middleware;
        const endpointSpy: SinonSpy = <SinonSpy>endpoint;
        const func: AzureFunction = tricycle
            .middlware(middleware)
            .endpoint(endpoint);
        expect(func).to.be.a('function');
        expect((middlewareSpy).callCount).to.equal(0);
        expect((endpointSpy).callCount).to.equal(0);
        const results = await mockCallFunc(func);
        expect((middlewareSpy).callCount).to.equal(1);
        expect((endpointSpy).callCount).to.equal(1);
        expect(results.response.body).to.be.an('object');
        expect((<TestBody>results.response.body).ok).to.equal(true);
        expect((<TestBody>results.response.body).index).to.equal(1);
    });
});
