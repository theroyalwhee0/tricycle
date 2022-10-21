import { URL } from 'node:url';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { HttpRequest } from '../../src/http/request';
import { mockTricycle } from '../mock/tricycle';
import { mockAzureContext } from '../mock/azure';

describe('request', () => {
    it('should be a class', () => {
        expect(HttpRequest).to.be.a('function');
    });
    it('should be instanceable', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request).to.be.instanceOf(HttpRequest);
    });
    it('should have an URL object', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.URL).to.be.an.instanceOf(URL);
        expect(request.URL.toString()).to.equal('https://localhost:9090/registration?campaign=summerfest');
    });
    it('should have an originalUrl string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.originalUrl).to.equal('https://localhost:9090/registration?campaign=summerfest');
    });
    it('should have a href string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.href).to.equal('https://localhost:9090/registration?campaign=summerfest');
    });
    it('should have an url string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.url).to.equal('/registration?campaign=summerfest');
    }); 
    it('should have a path string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.path).to.equal('/registration');
    });     
    it('should have a query string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.querystring).to.equal('campaign=summerfest');
    });
    it('should have a search string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.search).to.equal('?campaign=summerfest');
    });
    it('should have a query object', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.query).to.eql({ 'campaign': 'summerfest' });
    });
    it('should have a method string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.method).to.equal('GET');        
    });    
    it('should have a ip string', () => {
        const tricycle = mockTricycle();
        const azureContext = mockAzureContext();
        const request = new HttpRequest(tricycle, azureContext);
        expect(request.ip).to.equal('10.9.8.7');
    });
});
