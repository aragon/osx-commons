import {
  InvalidDigitsValueError,
  InvalidRatioValueError,
  ValueOutOfRangeError,
} from './errors';
import {BigNumber} from '@ethersproject/bignumber';

/**
 * The base ratio used for percentage calculations (10^6)
 */
export const RATIO_BASE = BigNumber.from(10).pow(6); // 100% => 10**6

/**
 * Converts a percentage to a ratio using the ratio base (10^6)
 * 100.0000% -> 1_000_000
 * 99.9999% ->   999_999
 * 0.0001% ->         1
 * 0.0000% ->         0
 * @param x
 * @returns BigNumber
 */
export const pctToRatio = (x: number) => RATIO_BASE.mul(x).div(100);

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
