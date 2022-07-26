import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Context } from '../src/context';

describe('Context', () => {
    it('should be a class', () => {
        expect(Context).to.be.a('function');
    });
    it('should have params member', () => {
        const ctx = new Context();
        expect(ctx.params).to.eql({});
    });
});
