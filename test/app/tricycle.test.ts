import { describe, it } from 'mocha';
import { expect } from 'chai';
// import { spy, SinonSpy } from 'sinon';
// import { AzureFunction } from '@azure/functions';
import { Tricycle } from '../../src/index';

describe('Tricycle', () => {
    it('should be a class', () => {
        expect(Tricycle).to.be.a('function');
    });
    it('should be instanceable', () => {
        const tricycle = new Tricycle();
        expect(tricycle).to.be.instanceOf(Tricycle);
    });
});
