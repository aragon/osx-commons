import {BigNumber} from '@ethersproject/bignumber';

/**
 * Enum for PermissionType
 * Reference:
 *
 * @export
 * @enum {number}
 */
export enum Operation {
  Grant = 0,
  Revoke = 1,
  GrantWithCondition = 2,
}

export const PERMISSION_MANAGER_FLAGS = {
  UNSET_FLAG: `0x${'0'.repeat(40)}`, // address(0)
  ALLOW_FLAG: `0x${'0'.repeat(39)}2`, // address(2)
  ANY_ADDR: `0x${'f'.repeat(40)}`, // address(-1)
  NO_CONDITION: `0x${'0'.repeat(40)}`, // address(0)
};

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
