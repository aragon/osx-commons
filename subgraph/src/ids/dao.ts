import {Address} from '@graphprotocol/graph-ts';
import {getIdFromAddress} from '../utils/ids';

export function getDaoId(dao: Address): string {
  return getIdFromAddress(dao);
}
