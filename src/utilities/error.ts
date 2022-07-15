import { isObject } from "@theroyalwhee0/istype";

interface OptionsWithCause {
    cause: Error,
    errors?: never
}

interface OptionsWithErrors {
    cause?: never,
    errors: Array<Error>
}

export type DetailedErrorOptions = OptionsWithCause | OptionsWithErrors;

function isError(value: DetailedErrorOptions | Error): value is Error {
    return 'message' in value && 'stack' in value;
}

function isWithCause(value: DetailedErrorOptions | Error): value is OptionsWithCause {
    return 'cause' in value;
}

function isWithErrors(value: DetailedErrorOptions | Error): value is OptionsWithErrors {
    return 'errors' in value;
}

export class DetailedError extends Error {
    errors: Array<Error> = []

    constructor(message: string, options?: DetailedErrorOptions | Error) {
        super(message);
        if (isObject(options)) {
            if (isError(options)) {
                this.errors.push(options);
            } else if (isWithCause(options)) {
                this.errors.push(options.cause);
            } else if (isWithErrors(options)) {
                this.errors = options.errors.concat();
            }
        }
    }
}
