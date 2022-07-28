import { isArray, isObject } from "@theroyalwhee0/istype"
import { JsonArray, JsonObject, JsonValue } from "./utilities/json"
import { Headers } from './headers';
import { MimeTypes } from "./mimetypes";

export type RequestParams = Record<string, string>

export interface IRequest {
    method: string
    url: string
    body?: JsonValue
    rawBody?: string
    params: RequestParams
}

export type RequestBody = JsonValue;

export class Request<TBody extends RequestBody = JsonValue> implements IRequest {
    method: string
    url: string
    body?: TBody
    rawBody?: string
    type: string
    originalUrl: string
    params: RequestParams = {}
    headers: Headers = {}

    // is(mimeType: 'application/json'): this is Request<JsonValue>;
    is(mimeType: string, ...mimeTypes: string[]): boolean | null | string {
        // NOTE: This does not impliment pattern matching.
        if (this.body === undefined) {
            return null
        } else if (
            (this.type === mimeType) ||
            (mimeTypes.includes(this.type))
        ) {
            return this.type;
        } else {
            return false;
        }
    }

    // isJson(): this is Request<JsonValue> {
    //     return this.is(MimeTypes.JSON);
    // }

    // isJsonObject(): this is Request<JsonObject> {
    //     return this.isJson() && isObject(this.body);
    // }

    // isJsonArray(): this is Request<JsonArray> {
    //     return this.isJson() && isArray(this.body);
    // }
}