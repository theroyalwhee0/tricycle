/**
 * HTTP Statuses.
 * This is not a comprehensive list.
 * Statuses are still valid outside of these.
 */

// Success
export const OK = 200 as const;
export type OK = 200;
export const CREATED = 201 as const;
export type CREATED = 201;
export const ACCEPTED = 202 as const;
export type ACCEPTED = 202;
export const NONAUTHORITATIVE_INFORMATION = 203 as const;
export type NONAUTHORITATIVE_INFORMATION = 203;
export const NO_CONTENT = 204 as const;
export type NO_CONTENT = 204;
export const RESET_CONTENT = 205 as const;
export type RESET_CONTENT = 205;
export const PARTIAL_CONTENT = 206 as const;
export type PARTIAL_CONTENT = 206;

// Redirect
export const MULTIPLE_CHOICES = 300 as const;
export type MULTIPLE_CHOICES = 300;
export const MOVED_PERMANENTLY = 301 as const;
export type MOVED_PERMANENTLY = 301;
export const FOUND = 302 as const;
export type FOUND = 302;
export const SEE_OTHER = 303 as const;
export type SEE_OTHER = 303;
export const NOT_MODIFIED = 304 as const;
export type NOT_MODIFIED = 304;
export const TEMPORARY_REDIRECT = 307 as const;
export type TEMPORARY_REDIRECT = 307;
export const PERMANENT_REDIRECT = 308 as const;
export type PERMANENT_REDIRECT = 308;

// Client
export const BAD_REQUEST = 400 as const;
export type BAD_REQUEST = 400;
export const UNAUTHORIZED = 401 as const;
export type UNAUTHORIZED = 401;
export const PAYMENT_REQUIRED = 402 as const;
export type PAYMENT_REQUIRED = 402;
export const FORBIDDEN = 403 as const;
export type FORBIDDEN = 403;
export const NOT_FOUND = 404 as const;
export type NOT_FOUND = 404;
export const METHOD_NOT_ALLOWED = 405 as const;
export type METHOD_NOT_ALLOWED = 405;
export const NOT_ACCEPTABLE = 406 as const;
export type NOT_ACCEPTABLE = 406;
export const PROXY_AUTHENTICATION_REQUIRED = 407 as const;
export type PROXY_AUTHENTICATION_REQUIRED = 407;
export const REQUEST_TIMEOUT = 408 as const;
export type REQUEST_TIMEOUT = 408;
export const CONFLICT = 409 as const;
export type CONFLICT = 409;
export const GONE = 410 as const;
export type GONE = 410;
export const LENGTH_REQUIRED = 411 as const;
export type LENGTH_REQUIRED = 411;
export const PRECONDITION_FAILED = 412 as const;
export type PRECONDITION_FAILED = 412;
export const PAYLOAD_TOO_LARGE = 413 as const;
export type PAYLOAD_TOO_LARGE = 413;
export const URI_TOO_LONG = 414 as const;
export type URI_TOO_LONG = 414;
export const UNSUPPORTED_MEDIA_TYPE = 415 as const;
export type UNSUPPORTED_MEDIA_TYPE = 415;
export const RANGE_NOT_SATISFIABLE = 416 as const;
export type RANGE_NOT_SATISFIABLE = 416;
export const EXPECTATION_FAILED = 417 as const;
export type EXPECTATION_FAILED = 417;
export const IM_A_TEAPOT = 418 as const;
export type IM_A_TEAPOT = 418;
export const MISDIRECTED_REQUEST = 421 as const;
export type MISDIRECTED_REQUEST = 421;
export const UPGRADE_REQUIRED = 426 as const;
export type UPGRADE_REQUIRED = 426;
export const PRECONDITION_REQUIRED = 428 as const;
export type PRECONDITION_REQUIRED = 428;
export const TOO_MANY_REQUESTS = 429 as const;
export type TOO_MANY_REQUESTS = 429;
export const REQUEST_HEADER_FIELDS_TOO_LARGE = 431 as const;
export type REQUEST_HEADER_FIELDS_TOO_LARGE = 431;
export const UNAVAILABLE_FOR_LEGAL_REASONS = 451 as const;
export type UNAVAILABLE_FOR_LEGAL_REASONS = 451;

// Server
export const SERVER_ERROR = 500 as const;
export type SERVER_ERROR = 500;
export const NOT_IMPLEMENTED = 501 as const;
export type NOT_IMPLEMENTED = 501;
export const BAD_GATEWAY = 502 as const;
export type BAD_GATEWAY = 502;
export const SERVICE_UNAVAILABLE = 503 as const;
export type SERVICE_UNAVAILABLE = 503;
export const GATEWAY_TIMEOUT = 504 as const;
export type GATEWAY_TIMEOUT = 504;
