import {Address, BigInt, Bytes, ethereum} from '@graphprotocol/graph-ts';

/**
 * Create a ethereum.Tuple for the actions parameters.
 *
 * @export
 * @param {string} address
 * @param {string} value
 * @param {string} data
 * @return {*}  {ethereum.Tuple}
 */
export function createDummyAction(
  to: string,
  value: string,
  data: string
): ethereum.Tuple {
  const tuple = new ethereum.Tuple();

  tuple.push(ethereum.Value.fromAddress(Address.fromString(to)));
  tuple.push(ethereum.Value.fromSignedBigInt(BigInt.fromString(value)));
  tuple.push(ethereum.Value.fromBytes(Bytes.fromHexString(data)));

  return tuple;
}
