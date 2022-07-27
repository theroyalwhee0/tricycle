import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Context } from '../src/context';
import { mockTricycle } from './mock/tricycle';
import { Tricycle } from '../src/tricycle';

describe('Context', () => {
    it('should be a class', () => {
        expect(Context).to.be.a('function');
    });
    it('should be instanceable', () => {
        const ctx = new Context(mockTricycle());
        expect(ctx).to.be.instanceOf(Context);
    });
    it('should have params member', () => {
        const ctx = new Context(mockTricycle());
        expect(ctx.params).to.eql({});
    });
    it('should have app member', () => {
        const app = mockTricycle();
        const ctx = new Context(app);
        expect(ctx.app).to.be.instanceOf(Tricycle);
        expect(ctx.app).to.equal(app);
    });
});
