import { expect } from 'chai';
import { describe, it } from 'mocha';
import { HttpContext, HttpContextRequired } from '../../src/http/context';
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
    it('should remove Content-Type and Body if Status is 204', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.status = 204;
        ctx.response.headers[contentType] = applicationJson;
        ctx.response.body = { ok: true };
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(204);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(undefined);
    });
    it('should set Status to 200 if a body is set', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.body = { ok: true };
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(200);
        expect(azureResponse.body).to.eql({ ok: true });
    });
    it('should set Content-Type to application/octet-stream if no Content-Type is set', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext> = mockHttpContext(tricycle);
        // @ts-expect-error Use a symbol so that no other rules kick in.
        ctx.response.body = Symbol('Use a symbol so that no other rules kick in.');
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(200);
        expect(azureResponse.headers[contentType]).to.equal(octetStream);
    });

    it('no-response into a 404 with text body', async () => {
        // NOTE: This is no difference between this and only setting
        // ctx.response.body = undefined;
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(404);
        expect(azureResponse.body).to.equal('Not Found');
        expect(azureResponse.headers[contentType]).to.equal(plainText);
    });
    it('only content-type into a 404', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.headers[contentType] = octetStream;
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(404);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(octetStream);
    });
    it('only null body into a 204', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.body = null;
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(204);
        expect(azureResponse.body).to.equal(undefined);
        expect(azureResponse.headers[contentType]).to.equal(undefined);
    });
    it('only string body into a 200 plain text', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.body = 'OK';
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(200);
        expect(azureResponse.body).to.equal('OK');
        expect(azureResponse.headers[contentType]).to.equal(plainText);
    });

    it('only array body into a 200 json', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.body = [ 1, 2, 3, 4 ];
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(200);
        expect(azureResponse.body).to.eql([ 1, 2, 3, 4 ]);
        expect(azureResponse.headers[contentType]).to.equal(applicationJson);
    });
    it('only object body into a 200 json', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.body = { one: 1 };
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(200);
        expect(azureResponse.body).to.eql({ one: 1 });
        expect(azureResponse.headers[contentType]).to.equal(applicationJson);
    });
    it('only boolean body into a 200 json', async () => {
        const tricycle = mockTricycle();
        const ctx:HttpContextRequired<HttpContext>  = mockHttpContext(tricycle);
        ctx.response.body = true;
        await transformHttpResponse(ctx);
        const azureResponse = ctx.platform.azureContext.res;
        if(!azureResponse) {
            expect.fail('Azure Context Response should be an object.');
        }
        expect(azureResponse.statusCode).to.equal(200);
        expect(azureResponse.body).to.equal(true);
        expect(azureResponse.headers[contentType]).to.equal(applicationJson);
    });       
});
