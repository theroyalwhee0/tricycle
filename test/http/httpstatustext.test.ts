import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HttpStatusText } from '../../src/http/httpstatustext';

describe("HttpStatusText", () => {
    it('should be an object', () => {
        expect(HttpStatusText).to.be.an('object');
    });
    it('shoud have http statuses', () => {
        expect(HttpStatusText).to.have.property('OK');
        expect(HttpStatusText.OK).to.equal("OK");
        expect(HttpStatusText.NOT_FOUND).to.equal("Not Found");        
    });
});