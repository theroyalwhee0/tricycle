import { URL } from 'node:url';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { Request } from '../src/request';
import { mockAzureContext } from './mock/azurefunction';

describe('request', () => {
    it('should be a class', () => {
        expect(Request).to.be.a('function');
    });
    it('should be instanceable', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request).to.be.instanceOf(Request);
    });
    it('should have an URL object', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.URL).to.be.an.instanceOf(URL);
        expect(request.URL.toString()).to.equal('https://localhost:9090/registration?c=summer2022');
    });
    it('should have an originalUrl string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.originalUrl).to.equal('https://localhost:9090/registration?c=summer2022');
    });
    it('should have a href string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.href).to.equal('https://localhost:9090/registration?c=summer2022');
    });
    it('should have an url string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.url).to.equal('/registration?c=summer2022');
    }); 
    it('should have a path string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.path).to.equal('/registration');
    });     
    it('should have a query string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.querystring).to.equal('c=summer2022');
    });
    it('should have a search string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.search).to.equal('?c=summer2022');
    });
    it('should have a query object', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.query).to.eql({ 'c': 'summer2022' });
    });
    it('should have a method string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.method).to.equal('GET');        
    });    
    it('should have a ip string', () => {
        const azureContext = mockAzureContext();
        const request = new Request(azureContext, azureContext.req);
        expect(request.ip).to.equal('10.9.8.7');
    });
});
