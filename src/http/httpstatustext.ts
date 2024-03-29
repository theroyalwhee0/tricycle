/**
 * HTTP status messages.
 * This is not a comprehensive list.
 */
export enum HttpStatusText {
    // Information
    CONTINUE = 'Continue',
    SWITCHING_PROTOCOLS = 'Switching Protocols',
    PROCESSING = 'Processing',

    // Success
    OK = 'OK',
    CREATED = 'Created',
    ACCEPTED = 'Accepted',
    // NONAUTHORITATIVE_INFORMATION = "NONAUTHORITATIVE_INFORMATION",
    NO_CONTENT = 'No Content',
    // RESET_CONTENT = "RESET_CONTENT",
    // PARTIAL_CONTENT = "PARTIAL_CONTENT",

    // Redirect
    // MULTIPLE_CHOICES = "MULTIPLE_CHOICES",
    // MOVED_PERMANENTLY = "MOVED_PERMANENTLY",
    // FOUND = "FOUND",
    // SEE_OTHER = "SEE_OTHER",
    // NOT_MODIFIED = "NOT_MODIFIED",
    // TEMPORARY_REDIRECT = "TEMPORARY_REDIRECT",
    // PERMANENT_REDIRECT = "PERMANENT_REDIRECT",

    // Client
    BAD_REQUEST = 'Bad Request',
    // UNAUTHORIZED = "UNAUTHORIZED",
    // PAYMENT_REQUIRED = "PAYMENT_REQUIRED",
    FORBIDDEN = 'Forbidden',
    NOT_FOUND = 'Not Found',
    // METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED",
    // NOT_ACCEPTABLE = "NOT_ACCEPTABLE",
    // PROXY_AUTHENTICATION_REQUIRED = "PROXY_AUTHENTICATION_REQUIRED",
    // REQUEST_TIMEOUT = "REQUEST_TIMEOUT",
    // CONFLICT = "CONFLICT",
    // GONE = "GONE",
    // LENGTH_REQUIRED = "LENGTH_REQUIRED",
    // PRECONDITION_FAILED = "PRECONDITION_FAILED",
    // PAYLOAD_TOO_LARGE = "PAYLOAD_TOO_LARGE",
    // URI_TOO_LONG = "URI_TOO_LONG",
    // UNSUPPORTED_MEDIA_TYPE = "UNSUPPORTED_MEDIA_TYPE",
    // RANGE_NOT_SATISFIABLE = "RANGE_NOT_SATISFIABLE",
    // EXPECTATION_FAILED = "EXPECTATION_FAILED",
    // IM_A_TEAPOT = "IM_A_TEAPOT",
    // MISDIRECTED_REQUEST = "MISDIRECTED_REQUEST",
    // UPGRADE_REQUIRED = "UPGRADE_REQUIRED",
    // PRECONDITION_REQUIRED = "PRECONDITION_REQUIRED",
    // TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",
    // REQUEST_HEADER_FIELDS_TOO_LARGE = "REQUEST_HEADER_FIELDS_TOO_LARGE",
    // UNAVAILABLE_FOR_LEGAL_REASONS = "UNAVAILABLE_FOR_LEGAL_REASONS",

    // Server
    SERVER_ERROR = 'Server Error',
    NOT_IMPLEMENTED = 'Not Implemented',
    BAD_GATEWAY = 'Bad Gateway',
    SERVICE_UNAVAILABLE = 'Service Unavailable',
    GATEWAY_TIMEOUT = 'Gateway Timeout',
}
