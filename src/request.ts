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

export type RequestWithBody<T extends RequestBody> = RequiredProperty<Request<T>, 'body'>

type RequiredProperty<T, K extends keyof T> = T & {
    [P in K]-?: T[P];
};

export type MimeBodyMap = {
    'application/json': JsonValue
}

export type MimeBodyKeys = keyof MimeBodyMap;

export class Request<TBody extends RequestBody = JsonValue> implements IRequest {
    method: string
    url: string
    body?: TBody
    rawBody?: string
    type: string
    originalUrl: string
    params: RequestParams = {}
    headers: Headers = {}

    is(...mimeTypes: string[]): boolean | null | string {
        // NOTE: This does not impliment pattern matching (image/*).
        // NOTE: This does not impliment mime type aliases (json).
        if (this.body === undefined) {
            return null
        } else if (mimeTypes.includes(this.type)) {
            return this.type;
        } else {
            return false;
        }
    }

    isType<K extends MimeBodyKeys | string>(mimeType: K): this is RequestWithBody<K extends MimeBodyKeys ? MimeBodyMap[K] : RequestBody> {
        return !!this.is(mimeType);
    }

    isJson<T extends JsonValue = JsonValue>(): this is RequestWithBody<T> {
        return this.isType('application/json');
    }

    isJsonObject<T extends JsonObject = JsonObject>(): this is RequestWithBody<T> {
        return isObject(this.body) && this.isJson<T>();
    }

    isJsonArray<T extends JsonArray = JsonArray>(): this is RequestWithBody<T> {
        return isArray(this.body) && this.isJson();
    }
}