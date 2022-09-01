import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Context } from '../src/context';
import { mockTricycle } from './mock/tricycle';
import { mockAzureContext  } from './mock/azurefunction';
import { Tricycle } from '../src/tricycle';

describe('Context', () => {
    it('should be a class', () => {
        expect(Context).to.be.a('function');
    });
    it('should be instanceable', () => {
        const app = mockTricycle();
        const azureContext = mockAzureContext();
        const ctx = new Context(app, azureContext, azureContext.req);
        expect(ctx).to.be.instanceOf(Context);
    });
    it('should have params member', () => {
        const app = mockTricycle();
        const azureContext = mockAzureContext();
        const ctx = new Context(app, azureContext, azureContext.req);
        expect(ctx.params).to.eql({});
    });
    it('should have app member', () => {
        const app = mockTricycle();
        const azureContext = mockAzureContext();
        const ctx = new Context(app, azureContext, azureContext.req);
        expect(ctx.app).to.be.instanceOf(Tricycle);
        expect(ctx.app).to.equal(app);
    });
});
