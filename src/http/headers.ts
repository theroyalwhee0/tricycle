import { isString } from '@theroyalwhee0/istype';

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
    /*
     * @param value The header value to use.
     * @param clone Clone if true, wrap if false.
     */
    constructor(value: Headers={}, clone = false) { 
        if (clone) {
            value = Object.assign({}, value);
        }
        const mapping: Record<string, string> = {};
        Object.keys(value).forEach((key) => {
            insertKey(key);
        });
        function getKey(prop: string): string | undefined {
            if (isString(prop)) {
                const lower = prop.toLowerCase();
                if (lower in mapping) {
                    return mapping[lower];
                } else {
                    return undefined;
                }
            } else {
                return prop;
            }
        }
        function insertKey(prop: string): string {
            if (isString(prop)) {
                const lower = prop.toLowerCase();
                if (lower in mapping) {
                    return mapping[lower];
                } else {
                    mapping[lower] = prop;
                    return prop;
                }
            } else {
                return prop;
            }
        }
        return new Proxy<CaseInsensitiveHeaders>(value, {
            has(_target, prop: string): boolean {
                return getKey(prop) !== undefined;
            },
            get(target:Headers, prop: string): string | undefined {
                const key = getKey(prop);
                if (key === undefined) {
                    return undefined;
                } else {
                    return target[key];
                }
            },
            set(target, prop: string, value): boolean {
                const key = insertKey(prop);
                target[key] = value;
                return true;
            },
            deleteProperty(target, prop: string): boolean {
                const key = getKey(prop);
                const lower = prop.toLowerCase();
                if (lower in mapping) {
                    delete mapping[lower];
                }
                if (key !== undefined && key in target) {
                    delete target[key];
                    return true;
                }
                return false;
            },
        });
    }

    /**
     * Key/Value Header pairs.
     */
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
    Authorization = 'authorization',
    // authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
    CacheControl = 'cache-control',
    // cache-control: max-age=0
    Connection = 'connection',
    // connection: keep-alive
    ContentEncoding = 'content-encoding',
    // content-encoding: gzip
    ContentSecurityPolicy = 'content-security-policy',
    // content-security-policy: default-src 'none';img-src 'self';style-src 'self'
    ContentType = 'content-type',
    // content-type: text/html
    Date = 'date',
    // date = Tue, 12 Jul 2022 21:09:53 GMT
    ETag = 'etag',
    // etag: "ab3bb444774e6d8e079a0e7186ed2037"
    ForwardedFor = 'x-forwarded-for',
    // x–forwarded-for: 203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348, 10.9.8.7
    Host = 'host',
    // host: www.example.com
    ReferrerPolicy = 'referrer-policy',
    // referrer-policy: strict-origin-when-cross-origin
    Server = 'server',
    // serve = Apache 2
    StrictTransportSecurity = 'strict-transport-security',
    // strict-transport-security: max-age=31536000; includeSubdomains
    UserAgent = 'user-agent',
    // user-agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:96.0) Gecko/20100101 Firefox/96.0
    Vary = 'vary',
    // vary: accept-encoding
}
