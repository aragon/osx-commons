import {ADDRESS_REGEX} from './constants';

export function isAddress(address: string): boolean {
  return ADDRESS_REGEX.test(address);
}
