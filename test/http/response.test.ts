import { URL } from 'node:url';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HttpResponse } from '../../src/http/response';
import { mockTricycle } from '../mock/tricycle';
import { mockAzureContext } from '../mock/azure';

describe('response', () => {
    it('should be a class', () => {
        expect(HttpResponse).to.be.a('function');
    });
    it('should be instanceable', () => {
        const tricycle = mockTricycle()
        const azureContext = mockAzureContext();
        const request = new HttpResponse(tricycle, azureContext);
        expect(request).to.be.instanceOf(HttpResponse);
    });

    it('should have headers', () => {
        const tricycle = mockTricycle()
        const azureContext = mockAzureContext();
        const response = new HttpResponse(tricycle, azureContext);
        expect(response.headers).to.be.an('object');
        response.headers['Content-Type'] = 'application/json';
        expect(response.headers['Content-Type']).to.equal('application/json');
        expect(response.headers['content-type']).to.equal('application/json');
    });

    it('should be able to replace headers', () => {
        const tricycle = mockTricycle()
        const azureContext = mockAzureContext();
        const response = new HttpResponse(tricycle, azureContext);
        expect(response.headers).to.be.an('object');
        response.headers['Content-Type'] = 'application/json';
        response.headers = {
            'accept-language': 'en-US,en;q=0.5'
        };
        expect(response.headers['Accept-Language']).to.equal('en-US,en;q=0.5');
        expect(response.headers['accept-language']).to.equal('en-US,en;q=0.5');
        expect(response.headers['content-type']).to.equal(undefined);
    });

    it('should be able to get a header', () => {
        const tricycle = mockTricycle()
        const azureContext = mockAzureContext();
        const response = new HttpResponse(tricycle, azureContext);
        response.headers['Content-Type'] = 'application/json';
        expect(response.get('Content-Type')).to.equal('application/json');
        expect(response.get('content-type')).to.equal('application/json');
        expect(response.get('location')).to.equal(undefined);
    });

    it('should be able to set a header', () => {
        const tricycle = mockTricycle()
        const azureContext = mockAzureContext();
        const response = new HttpResponse(tricycle, azureContext);
        response.set('Content-Type', 'application/json')
        expect(response.get('Content-Type')).to.equal('application/json');
        expect(response.get('content-type')).to.equal('application/json');
        expect(response.get('location')).to.equal(undefined);
    });

    it('should be able to check if request has a header specified', () => {
        const tricycle = mockTricycle()
        const azureContext = mockAzureContext();
        const response = new HttpResponse(tricycle, azureContext);
        response.headers['Content-Type'] = 'application/json';
        expect(response.has('Content-Type')).to.equal(true);
        expect(response.has('content-type')).to.equal(true);
        expect(response.has('location')).to.equal(false);
    });        
});
