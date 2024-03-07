import {HEX_STRING_REGEX} from './constants';

/**
 * Checks if a string is a valid hex string
 *
 * @export
 * @param {string} value
 * @return {boolean}
 */
export function isHexString(value: string): boolean {
  return HEX_STRING_REGEX.test(value);
}

/**
 * Ensures that a hex string has the "0x" prefix
 *
 * @export
 * @param {string} value
 * @return {string}
 */
export function ensure0x(value: string): string {
  return value.startsWith('0x') ? value : '0x' + value;
}

/**
 * Strips the "0x" prefix from a hex string
 *
 * @export
 * @param {string} value
 * @return {string}
 */
export function strip0x(value: string): string {
  return value.startsWith('0x') ? value.substring(2) : value;
}
