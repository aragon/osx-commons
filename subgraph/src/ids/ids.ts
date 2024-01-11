import {Address, BigInt, Bytes} from '@graphprotocol/graph-ts';

/**
 * Returns a valid entity ID based on the provided address.
 *
 * @export
 * @param {Address} address
 * @return {*}  {string}
 */
export function generateEntityIdFromAddress(address: Address): string {
  return address.toHexString();
}

/**
 * Returns a valid entity ID based on the provided bytes.
 *
 * @export
 * @param {Bytes} bytes
 * @return {*}  {string}
 */
export function generateEntityIdFromBytes(bytes: Bytes): string {
  return bytes.toHexString();
}

/**
 * Returns a valid entity ID based on the provided BigInt.
 *
 * @export
 * @param {BigInt} number
 * @return {*}  {string}
 */
export function generateEntityIdFromBigInt(number: BigInt): string {
  return number.toHexString();
}
