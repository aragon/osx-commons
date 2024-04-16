import {BigNumber} from '@ethersproject/bignumber';

// The base ratio used for percentage calculations (10^6)
export const RATIO_BASE = BigNumber.from(10).pow(6); // 100% => 10**6
/**
 * Converts a percentage to a ratio using the ratio base (10^6)
 * 100.0000% -> 1_000_000
 * 99.9999% ->   999_999
 * 0.0001% ->         1
 * 0.0000% ->         0
 */
export const pctToRatio = (x: number) => RATIO_BASE.mul(x).div(100);
