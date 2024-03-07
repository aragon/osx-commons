import {
  InvalidDigitsValueError,
  InvalidRatioValueError,
  ValueOutOfRangeError,
} from './errors';

/**
 * Encodes a 0-1 ratio within the given digit precision for storage on a smart contract
 *
 * @export
 * @param {number} ratio
 * @param {number} digits
 * @return {bigint}
 */
export function encodeRatio(ratio: number, digits: number): number {
  if (ratio < 0 || ratio > 1) {
    throw new InvalidRatioValueError(ratio);
  } else if (!Number.isInteger(digits) || digits < 1 || digits > 15) {
    throw new InvalidDigitsValueError(digits);
  }
  return Math.round(ratio * 10 ** digits);
}

/**
 * Decodes a value received from a smart contract to a number with
 *
 * @export
 * @param {bigint} onChainValue
 * @param {number} digits
 * @return {number}
 */
export function decodeRatio(
  onChainValue: bigint | number,
  digits: number
): number {
  if (!Number.isInteger(digits) || digits < 1 || digits > 15) {
    throw new InvalidDigitsValueError(digits);
  } else if (onChainValue > 10 ** digits) {
    throw new ValueOutOfRangeError();
  }

  return Number(onChainValue) / 10 ** digits;
}
