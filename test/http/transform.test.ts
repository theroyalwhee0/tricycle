import { expect } from 'chai';
import { describe, it } from 'mocha';
import { OnlyHttp } from '../../src/context/restrict';
import { HttpContext } from '../../src/http/context';
import { ResponseBody } from '../../src/http/response';
import { transformHttpResponse } from '../../src/http/transform';
import { mockHttpContext } from '../mock/context';
import { mockTricycle } from '../mock/tricycle';

const contentType = 'content-type';
const plainText = 'text/plain';
const applicationJson = 'application/json';
const octetStream = 'application/octet-stream';

describe('transformHttpResponse', () => {
    it('should be an object', () => {
        expect(transformHttpResponse).to.be.a('function');
    });
    it('should remove Content-Type and Body if Status is 204', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.status = 204;
        context.response.headers[contentType] = applicationJson;
        context.response.body = { ok: true };
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(204);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(undefined);
    });
    it('should set Status to 200 if a body is set', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = { ok: true };
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(200);
        expect(azureResponse.body).to.eql({ ok: true });
    });
    it('should set Content-Type to application/octet-stream if no Content-Type is set', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        // Use a type-cast-symbol so that no other rules kick in.
        context.response.body = Symbol('Unknown') as unknown as ResponseBody;
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(200);
        expect(azureResponse.headers[contentType]).to.equal(octetStream);
    });

    it('no-response into a 404 with text body', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(404);
        expect(azureResponse.body).to.equal('Not Found');
        expect(azureResponse.headers[contentType]).to.equal(plainText);
    });
    it('only content-type into a 404', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.headers[contentType] = octetStream;
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(404);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(octetStream);
    });
    it('only null body into a 204', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = null;
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(204);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(undefined);
    });
    it('only undefined body into a 204', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = undefined;
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(204);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(undefined);
    });
    it('only string body into a 200 plain text', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = 'OK';
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(200);
        expect(azureResponse.body).to.equal('OK');
        expect(azureResponse.headers[contentType]).to.equal(plainText);
    });

    it('only array body into a 200 json', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = [ 1, 2, 3, 4 ];
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(200);
        expect(azureResponse.body).to.eql([ 1, 2, 3, 4 ]);
        expect(azureResponse.headers[contentType]).to.equal(applicationJson);
    });
    it('only object body into a 200 json', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = { one: 1 };
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(200);
        expect(azureResponse.body).to.eql({ one: 1 });
        expect(azureResponse.headers[contentType]).to.equal(applicationJson);
    });
    it('only boolean body into a 200 json', () => {
        const tricycle = mockTricycle();
        const context:OnlyHttp<HttpContext>  = mockHttpContext(tricycle);
        context.response.body = true;
        transformHttpResponse(context);
        const azureResponse = context.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.status).to.equal(200);
        expect(azureResponse.body).to.equal(true);
        expect(azureResponse.headers[contentType]).to.equal(applicationJson);
    });       
});
