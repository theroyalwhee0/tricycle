import { isString } from "@theroyalwhee0/istype";

/**
 * HTTP Headers interface.
 */
export interface Headers {
    [key: string]: string
}

/**
 * Case insensitive headers.
 * Initial key case will be preserved..
 */
export class CaseInsensitiveHeaders implements Headers {
    #mapping: Record<string, string> = {};
    #getKey(prop: string): string | undefined {
        if (isString(prop)) {
            const lower = prop.toLowerCase();
            if (lower in this.#mapping) {
                return this.#mapping[lower];
            } else {
                return undefined;
            }
        } else {
            return prop;
        }
    }
    #insertKey(prop: string): string {
        if (isString(prop)) {
            const lower = prop.toLowerCase();
            if (lower in this.#mapping) {
                return this.#mapping[lower];
            } else {
                this.#mapping[lower] = prop;
                return prop
            }
        } else {
            return prop;
        }
    }
    constructor(value?: Headers) {
        const proxy = new Proxy<CaseInsensitiveHeaders>(this, {
            has(target, prop: string): boolean {
                return target.#getKey(prop) !== undefined;
            },
            get(target, prop: string): string | undefined {
                const key = target.#getKey(prop);
                if (key === undefined) {
                    return undefined;
                } else {
                    return target[key];
                }
            },
            set(target, prop: string, value): boolean {
                const key = target.#insertKey(prop);
                target[key] = value;
                return true;
            },
            deleteProperty(target, prop: string): boolean {
                const key = target.#getKey(prop);
                if (prop in target.#mapping) {
                    delete target.#mapping[prop];
                }
                if (key !== undefined && key in target) {
                    delete target[key];
                    return true;
                }
                return false;
            }
        });
        if (value) {
            Object.assign(proxy, value);
        }
        return proxy;
    }
    [key: string]: string;
}

/**
 * Common HTTP Header names.
 * With examples in comments.
 */
export enum HeaderNames {
    Accept = 'accept',
    // accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
    AcceptEncoding = 'accept-encoding',
    // accept-encoding: gzip, deflate, br
    AcceptLanguage = 'accept-language',
    // accept-language: en-US,en;q=0.5
    CacheControl = 'cache-control',
    // cache-control: max-age=0
    ContentType = 'content-type',
    // content-type: text/html
    Connection = 'connection',
    // connection: keep-alive
    Date = 'date',
    // date = Tue, 12 Jul 2022 21:09:53 GMT
    ETag = 'etag',
    // etag: "ab3bb444774e6d8e079a0e7186ed2037"
    Host = 'host',
    // host: www.example.com
    Server = 'server',
    // serve = Apache 2
    UserAgent = 'user-agent'
    // user-agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0
}