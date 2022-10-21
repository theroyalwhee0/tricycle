import { isArray, isBoolean, isInteger, isObject, isString } from '@theroyalwhee0/istype';
import { Context, HttpStatus } from '..';
import { MimeTypes } from '../mimetypes';
import { HttpContextRequired } from './context';
import { HeaderNames } from './headers';
import { HttpStatusText } from './httpstatustext';
import { ResponseBody } from './response';
import { HTTP_STATUS_MAX, HTTP_STATUS_MIN } from './status';

export async function transformHttpResponse<TContext extends HttpContextRequired<Context>>(ctx:TContext) {
    const azureContext = ctx.platform.azureContext;
    const azureRequest = azureContext.req;
    const azureResponse = azureContext.res;
    if (!azureRequest) {
        throw new Error('Expected Azure Context Request to be an HttpRequest');
    }
    if (!azureResponse) {
        throw new Error('Expected Azure Context Response to be an object');
    }
    // Get initial response values.
    const headers = ctx.response.headers;
    let contentType = headers[HeaderNames.ContentType];
    let status: number|undefined = ctx.response.status;
    let body: ResponseBody = ctx.response.body;
    if (body === undefined && status === undefined) {
        // 404 if no body and no status were set.
        status = HttpStatus.NOT_FOUND;
        if (!contentType) {
            contentType = MimeTypes.TextPlain;
            body = HttpStatusText.NOT_FOUND;
        }
    } else if (body === null) {
        // If null and status is not set and content-type not set, set status to no-content.
        if (!contentType && status === undefined) {
            status = HttpStatus.NO_CONTENT;
            body = undefined;
        }
    } else if (isString(body)) {
        // If string and content-type not set, set to plain text.
        if (!contentType) {
            contentType = MimeTypes.TextPlain;
        }
    } else if (isArray(body) || isObject(body) || isBoolean(body)) {
        // If Array, Object, or Boolean and content-type not set, set to json.
        if (!contentType) {
            contentType = MimeTypes.ApplicationJson;
        }
    }
    if (status === undefined) {
        // Fallback to 200 status if not set yet.
        status = 200;
    }
    if(status === 204) {
        body = undefined;
        contentType = '';
    } else if (!contentType) {
        // Fallback to octet stream if not set yet.
        contentType = MimeTypes.ApplicationOctet;
    }
    // Validate status.
    if (
        (!isInteger(status)) ||
        status < HTTP_STATUS_MIN ||
        status > HTTP_STATUS_MAX
    ) {
        throw new Error(`"${status}" is not a valid HTTP status.`);
    }
    // Attach status, Content-Type, and body.
    if(contentType) {
        headers[HeaderNames.ContentType] = contentType;
    } else if(HeaderNames.ContentType in headers) {
        delete headers[HeaderNames.ContentType];
    }
    // Attach headers. Modify azureRequest if headers need to be set after this.
    Object.assign(azureResponse.headers, headers);
    // NOTE: use .statusCode, not .status here on the Azure Response.
    azureResponse.statusCode = status; 
    azureResponse.body = body;
}