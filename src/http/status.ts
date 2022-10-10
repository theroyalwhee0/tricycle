import { isInteger } from "@theroyalwhee0/istype";

/**
 * HTTP Status constants.
 */
export const HTTP_STATUS_MIN = 100;
export const HTTP_STATUS_MAX = 599;

/**
 * Is this a valid http status?
 * Note: Valid values do not have to be in the HttpStatus enum.
 * @param value {number} The http status to check.
 * @returns {boolean} True if valid, false if not.
 */
export function isValidHttpStatus(value: number): boolean {
    return isInteger(value) && value >= HTTP_STATUS_MIN && value <= HTTP_STATUS_MAX;
}
