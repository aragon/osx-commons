import {BigNumber} from '@ethersproject/bignumber';

export const RATIO_BASE = BigNumber.from(10).pow(6); // 100% => 10**6
export const pctToRatio = (x: number) => RATIO_BASE.mul(x).div(100);
