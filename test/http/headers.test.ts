import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HeaderNames, CaseInsensitiveHeaders } from '../../src/http/headers';

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
    it('should wrap an existing header object', () => {
        const wrapped = {
            A: "blue", // This should be replaced and case should be kept.
            C: "green", // This should be replaced and case should be kept.
            z: "red", // This should be left alone.
        };
        const headers = new CaseInsensitiveHeaders(wrapped);
        headers.a = 'one'; // This should replace 'A'.
        headers.b = 'two'; // This should insert 'b'.
        headers.c = 'three'; // This should replace 'C'.
        headers.C = 'four'; // This should replace 'C' again.
        const expected = {
            A: 'one',
            b: 'two',
            C: 'four',
            z: 'red'
        };
        expect(headers).to.eql(expected);
        expect(wrapped).to.eql(expected);
    });
    it('should clone an existing header object', () => {
        const wrapped = {
            A: "blue", // This should be replaced and case should be kept.
            C: "green", // This should be replaced and case should be kept.
            z: "red", // This should be left alone.
        };
        const headers = new CaseInsensitiveHeaders(wrapped, true);
        headers.a = 'one'; // This should replace 'A'.
        headers.b = 'two'; // This should insert 'b'.
        headers.c = 'three'; // This should replace 'C'.
        headers.C = 'four'; // This should replace 'C' again.
        expect(headers).to.eql({
            A: 'one',
            b: 'two',
            C: 'four',
            z: 'red'
        });
        expect(wrapped).to.eql({
            A: 'blue',
            C: 'green',
            z: 'red',
        });
    });
    it('should support deleting headers', () => {
        const headers = new CaseInsensitiveHeaders();
        headers.A = 'one';
        expect(headers).to.eql({ A: 'one', });
        expect(delete headers.A).to.equal(true);
        expect(headers).to.eql({ });
        headers.a = 'two';
        // This would equal { A: "two" } if it was not deleted above.
        expect(headers).to.eql({ a: 'two', });
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
