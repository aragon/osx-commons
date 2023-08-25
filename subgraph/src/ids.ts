import {Address} from '@graphprotocol/graph-ts';

export function getDaoId(daoAddress: Address): string {
  return daoAddress.toHexString();
}
