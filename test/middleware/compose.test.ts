import { describe, it } from 'mocha';
import { expect } from 'chai';
import { SinonSpy, spy } from 'sinon';
import { compose } from '../../src/middleware/compose';
import { Context } from '../../src/context';
import { Next } from '../../src/index';
import { mockNext, mockPlatformContext } from '../mock';

describe("compose", () => {
    it('should be an function', () => {
        expect(compose).to.be.a('function');
        expect(compose.length).to.equal(1);
    });
    it('should compose a single middleware', async () => {
        const middleware = spy((_ctx:Context, next:Next) => {
            return next();
        });
        const middlewareSpy:SinonSpy = middleware as SinonSpy;
        const composed = compose([ middleware ]);
        expect(composed).to.be.a('function');
        const ctx = mockPlatformContext();
        const next = mockNext();
        const nextSpy:SinonSpy = next as SinonSpy;
        const results = await composed(ctx, next);
        expect(results).to.be.undefined;
        expect(nextSpy.callCount).to.equal(1);
        expect(middlewareSpy.callCount).to.equal(1);
    });
    it('should compose a multiple middleware in correct order', async () => {
        const ordering:string[] = [];
        const middlewareA = spy(async (_ctx:Context, next:Next) => {
            ordering.push('a');
            await next();
            ordering.push('A');
        });
        const middlewareB = spy(async (_ctx:Context, next:Next) => {
            ordering.push('b');
            await next();
            ordering.push('B');
        });
        const middlewareC = spy(async (_ctx:Context, next:Next) => {
            ordering.push('c');
            await next();
            ordering.push('C');
        });
        const middleware = [
            middlewareA, middlewareB, middlewareC,
        ];
        const composed = compose(middleware);
        expect(composed).to.be.a('function');
        const ctx = mockPlatformContext();
        const next = mockNext();
        const nextSpy:SinonSpy = next as SinonSpy;
        const results = await composed(ctx, next);
        expect(results).to.be.undefined;
        expect(nextSpy.callCount).to.equal(1);
        for(let mw of middleware) {
            const mwSpy:SinonSpy = mw as SinonSpy;
            expect(mwSpy.callCount).to.equal(1);
        }
        expect(ordering).to.eql([
            'a', 'b', 'c', 'C', 'B', 'A',
        ]);
    });    
});