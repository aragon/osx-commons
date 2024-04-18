import {
  InvalidArraySizeError,
  InvalidBitMapValueError,
  InvalidBitPositionError,
} from './errors';
import {BigNumber} from '@ethersproject/bignumber';

/**
 * Flips a specific bit in a `BigNumber` object and returns a new `BigNumber` object with the bit flipped.
 *
 * @export
 * @param {number} index
 * @param {BigNumber} num
 * @return {BigNumber}
 */
export function flipBit(index: number, num: BigNumber): BigNumber {
  if (index < 0 || index > 255) {
    throw new InvalidBitPositionError(index);
  }
  const mask = BigNumber.from(1).shl(index);
  return num.xor(mask);
}

/**
 * Checks if a specific bit is set in a `BigNumber` object and returns `true` if the bit is set and `false` if it's not.
 *
 * @export
 * @param {number} index
 * @param {BigNumber} num
 * @return {boolean}
 */
export function getBit(index: number, num: BigNumber): boolean {
  if (index < 0 || index > 255) {
    throw new InvalidBitPositionError(index);
  }
  const mask = BigNumber.from(1).shl(index);
  return !num.and(mask).eq(0);
}

/**
 * Transforms a bigint into an array of booleans
 *
 * @param {bigint} bitmap
 * @return {Array<boolean>}
 */
export function bitmapToBoolArray(bitmap: bigint): Array<boolean> {
  if (bitmap >= BigInt(1) << BigInt(256)) {
    throw new InvalidBitMapValueError();
  }

  const result: Array<boolean> = [];
  for (let i = 0; i < 256; i++) {
    const mask = BigInt(1) << BigInt(i);
    result.push((bitmap & mask) != BigInt(0));
  }

  return result;
}

/**
 * Transforms an array of booleans into a bitmap big integer
 *
 * @export
 * @param {Array<boolean>} [bools]
 * @return {bigint}
 */
export function boolArrayToBitmap(bools?: Array<boolean>): bigint {
  if (!bools || !bools.length) return BigInt(0);
  else if (bools.length > 256) throw new InvalidArraySizeError(bools.length);

  let result = BigInt(0);
  for (let i = 0; i < 256; i++) {
    if (!bools[i]) continue;
    result |= BigInt(1) << BigInt(i);
  }
  return result;
}
