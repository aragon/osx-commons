import {ethers} from 'hardhat';

export const BLOCK_NUMBER_RULE_ID = 200;
export const TIMESTAMP_RULE_ID = 201;
export const CONDITION_RULE_ID = 202;
export const LOGIC_OP_RULE_ID = 203;
export const VALUE_RULE_ID = 204;

export enum Op {
  NONE,
  EQ,
  NEQ,
  GT,
  LT,
  GTE,
  LTE,
  RET,
  NOT,
  AND,
  OR,
  XOR,
  IF_ELSE,
}

export const DUMMY_PERMISSION_ID = ethers.utils.id('DUMMY_PERMISSION');
