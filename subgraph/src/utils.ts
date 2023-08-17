import {Address} from '@graphprotocol/graph-ts';

export function getIdFromStringArray(inputs: string[]): string {
  return inputs.join('_');
}

export function getIdFromAddress(address: Address): string {
  return address.toHexString();
}
