import { describe, it } from 'mocha';
import { expect } from 'chai';
import { spy, SinonSpy } from 'sinon';
import { AzureFunction } from '@azure/functions';
import { Tricycle } from '../src/tricycle';
import { Headers } from '../src/headers';
import { Context } from '../src/context';
import { Middleware } from '../src/middleware';
import { mockCallFunc } from './mock/azurefunction';
import { JsonObject } from '../src/utilities/json';
import { HttpStatus } from '../src/status';

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

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
        const tricycle = new Tricycle<TestContext>();
        const func: AzureFunction = tricycle
            .middleware(middleware)
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
    it('should call middlware and endpoint in correct order', async () => {
        const ordering: string[] = [];
        // Build a bunch of middleware.
        const mw: Middleware[] = [];
        for (let idx = 0; idx < 3; idx++) {
            const middleware: Middleware = spy(async (_context: Context, next) => {
                ordering.push(`mw${idx}a`);
                await delay(Math.min(10 * idx, 100));
                await next();
                await delay(Math.max(100 - (10 * idx), 10));
                ordering.push(`mw${idx}b`);
            });
            mw.push(middleware);
        }
        // Build the endpoint.
        const endpoint: Middleware = spy(async (context: Context, next) => {
            ordering.push(`ep0a`);
            await next();
            ordering.push(`ep0b`);
            context.response.body = ['test'];
        });
        let tricycle = new Tricycle();
        for (const middleware of mw) {
            // Add the middleware.
            tricycle = tricycle.middleware(middleware);
        }
        const func: AzureFunction = tricycle.endpoint(endpoint);
        // Call the endpoint.
        const results = await mockCallFunc(func);
        // Verify everything was called.
        expect((<SinonSpy>endpoint).callCount).to.equal(1);
        for (const middleware of mw) {
            expect((<SinonSpy>middleware).callCount).to.equal(1);
        }
        expect(ordering.join(' ')).to.eql([
            'mw0a', 'mw1a', 'mw2a',
            'ep0a', 'ep0b',
            'mw2b', 'mw1b', 'mw0b',
        ].join(' '));
        // Make sure things work in general.
        expect(results.response.body).to.be.eql(['test']);
    });
    it('should build allow body type specialzation in endpoint', async () => {
        const tricycle = new Tricycle();
        type CatBody = { cats: number, color?: string };
        const func: AzureFunction = tricycle.endpoint<CatBody>((ctx) => {
            ctx.body = { cats: 1 };
            // ctx.body.dogs = 1; // This should fail to compile.
        });
        expect(func).to.be.a('function');
        const results = await mockCallFunc(func);
        expect(results.response.body).to.be.an('object');
        expect((<CatBody>results.response.body).cats).to.equal(1);
    });
    it('should build allow body, status, and header type specialzation in endpoint', async () => {
        const tricycle = new Tricycle();
        type CatBody = { cats: number, color?: string };
        type CatStatus = HttpStatus.OK | HttpStatus.NOT_FOUND;
        type CatHeaders = {
            'x-im-a': 'cat'
        }
        const func: AzureFunction = tricycle.endpoint<CatBody, CatStatus, CatHeaders>((ctx) => {
            ctx.response.status = HttpStatus.OK;
            ctx.response.headers['x-im-a'] = 'cat';
            ctx.response.body = { cats: 1 };
            // ctx.body.dogs = 1; // This should fail to compile.
            // ctx.response.status = 500; // This should fail to compile.
            // ctx.response.headers['x-im-a'] = 'dog'; // This should fail to compile.
        });
        expect(func).to.be.a('function');
        const results = await mockCallFunc(func);
        expect(results.response.body).to.be.an('object');
        expect(results.response.status).to.equal(200);
        expect((<JsonObject>results.response.body).cats).to.equal(1);
        expect((<Headers>results.response.headers)['x-im-a']).to.equal('cat');
    });
});
