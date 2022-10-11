import { Context } from "../context";
import { OnlyHttp } from "../context/restrict";
import { MimeTypes } from "../mimetypes";
import { None, NoneType } from "../utilities/none";
import { HttpContext } from "./context";
import { HeaderNames, Headers } from './headers';

export type HttpFunction<TContext extends Context> = Awaited<(ctx: OnlyHttp<TContext>) => void>;

export async function buildHttpResponse(context: OnlyHttp<HttpContext>) {
    const azureContext = context.platform.azureContext;
    const azureRequest = azureContext.req;
    const azureResponse = azureContext.res;
    if(!azureRequest) {
        throw new Error(`Expected Azure Context Request to be an HttpRequest`);
    }
    if(!azureResponse) {
        throw new Error(`Expected Azure Context Response to be an object`);
    }
    // Set headers.
    const headers = context.response.headers;
    Object.assign(azureRequest.headers, headers);
    let contentType = headers[HeaderNames.ContentType];
    let status: number | NoneType = context.response.status;
    if(status === None) {
        // Fallback to 200 status if not set yet.
        status = 200;
    }            
    if(!contentType) {
        // Fallback to plain text if not set yet.
        contentType = MimeTypes.TextPlain;
    }
    azureResponse.status = status;
    azureResponse.headers[HeaderNames.ContentType] = contentType;    
}