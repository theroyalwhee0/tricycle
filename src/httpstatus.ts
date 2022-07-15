import { isInteger } from "@theroyalwhee0/istype";

/**
 * HTTP Status constants.
 */
export const HTTP_STATUS_MIN = 100;
export const HTTP_STATUS_MAX = 599;

/**
 * HTTP Status enumeration.
 * This is not a comprehensive list.
 * Statuses are still valid outside of these.
 */
export enum HttpStatus {
    // Success
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NONAUTHORITATIVE_INFORMATION = 203,
    NO_CONTENT = 204,
    RESET_CONTENT = 205,
    PARTIAL_CONTENT = 206,
    // Redirect
    MULTIPLE_CHOICES = 300,
    MOVED_PERMANENTLY = 301,
    FOUND = 302,
    SEE_OTHER = 303,
    NOT_MODIFIED = 304,
    TEMPORARY_REDIRECT = 307,
    PERMANENT_REDIRECT = 308,
    // Client
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    NOT_ACCEPTABLE = 406,
    PROXY_AUTHENTICATION_REQUIRED = 407,
    REQUEST_TIMEOUT = 408,
    CONFLICT = 409,
    GONE = 410,
    LENGTH_REQUIRED = 411,
    PRECONDITION_FAILED = 412,
    PAYLOAD_TOO_LARGE = 413,
    URI_TOO_LONG = 414,
    UNSUPPORTED_MEDIA_TYPE = 415,
    RANGE_NOT_SATISFIABLE = 416,
    EXPECTATION_FAILED = 417,
    IM_A_TEAPOT = 418,
    MISDIRECTED_REQUEST = 421,
    UPGRADE_REQUIRED = 426,
    PRECONDITION_REQUIRED = 428,
    TOO_MANY_REQUESTS = 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE = 431,
    UNAVAILABLE_FOR_LEGAL_REASONS = 451,
    // Server
    SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504
}

/**
 * Is this a valid http status?
 * Note: Valid values do not have to be in the HttpStatus enum.
 * @param value {number} The http status to check.
 * @returns {boolean} True if valid, false if not.
 */
export function isValidHttpStatus(value: number): boolean {
    return isInteger(value) && value >= HTTP_STATUS_MIN && value <= HTTP_STATUS_MAX;
}
