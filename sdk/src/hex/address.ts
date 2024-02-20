import {ADDRESS_REGEX} from './constants';
/**
 * Returns true if the given string is a valid Ethereum address
 *
 * @export
 * @param {string} address
 * @return {boolean}
 */
export function isAddress(address: string): boolean {
  return ADDRESS_REGEX.test(address);
}
