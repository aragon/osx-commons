import {InvalidHexStringError, OddLengthHexStringError} from './errors';
import {ensure0x, isHexString, strip0x} from './strings';

/**
 * Encodes a buffer into a hex string with the "0x" prefix
 *
 * @export
 * @param {string} hexString
 * @return {Uint8Array}
 */
export function hexToBytes(hexString: string): Uint8Array {
  if (!hexString) return new Uint8Array();
  else if (!isHexString(hexString)) {
    throw new InvalidHexStringError(hexString);
  } else if (hexString.length % 2 !== 0) {
    throw new OddLengthHexStringError();
  }

  hexString = strip0x(hexString);
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substring(i, i + 2), 16));
  }
  return Uint8Array.from(bytes);
}

/**
 * Encodes a buffer into a hex string with the "0x" prefix
 *
 * @export
 * @param {Uint8Array} buff
 * @param {boolean} [skip0x]
 * @return {string}
 */
export function bytesToHex(buff: Uint8Array, skip0x?: boolean): string {
  const bytes: string[] = [];
  for (let i = 0; i < buff.length; i++) {
    if (buff[i] >= 16) bytes.push(buff[i].toString(16));
    else bytes.push('0' + buff[i].toString(16));
  }
  if (skip0x) return bytes.join('');
  return ensure0x(bytes.join(''));
}
