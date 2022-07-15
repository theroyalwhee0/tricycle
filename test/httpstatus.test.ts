import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HttpStatus, isValidHttpStatus } from '../src/httpstatus';

describe("HttpStatus", () => {
    it('should be an object', () => {
        expect(HttpStatus).to.be.an('object');
    });
    it('shoud have http statuses', () => {
        expect(HttpStatus).to.have.property('OK');
        expect(HttpStatus.OK).to.equal(200);
    });
});

describe("isValidHttpStatus", () => {
    it('should be a function', () => {
        expect(isValidHttpStatus).to.be.a('function');
    });
    const validStatusCodes = [100, 200, 404, 500, 599,];
    validStatusCodes.forEach((value) => {
        it(`should validate valid status: ${value}`, () => {
            const result = isValidHttpStatus(value);
            expect(result).to.equal(true);
        });
    });
    const invalidStatusCodes = [0, 99, 200.1, 600, null, undefined, "200"];
    invalidStatusCodes.forEach((value) => {
        it(`should validate invalid status: ${value}`, () => {
            const result = isValidHttpStatus(value as number);
            expect(result).to.equal(false);
        });
    });
});
