import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HeaderNames, CaseInsensitiveHeaders } from '../src/headers';

describe('CaseInsensitiveHeaders', () => {
    it('should be a class', () => {
        expect(CaseInsensitiveHeaders).to.be.a('function');
    });
    it('should store headers', () => {
        const headers = new CaseInsensitiveHeaders();
        headers.a = 'one';
        headers.b = 'two';
        headers.c = 'three';
        headers.C = 'four';
        expect(headers).to.eql({
            a: 'one',
            b: 'two',
            c: 'four'
        });
    });
    it('should support deleting headers', () => {
        const headers = new CaseInsensitiveHeaders();
        headers.a = 'one';
        expect(headers).to.eql({ a: 'one', });
        expect(delete headers.a).to.equal(true);
        headers.A = 'two';
        expect(headers).to.eql({ A: 'two', });
    });
});

describe("HeaderNames", () => {
    it('should be an object', () => {
        expect(HeaderNames).to.be.an('object');
    });
    it('shoud have http statuses', () => {
        expect(HeaderNames).to.have.property('ContentType');
        expect(HeaderNames.ContentType).to.equal('content-type');
    });
});
