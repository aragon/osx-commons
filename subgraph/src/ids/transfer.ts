import {BigInt, Bytes} from '@graphprotocol/graph-ts';

/**
 * Generates the transfer entity ID using the transaction hash, log index, and action index.
 *
 * @param txHash - The transaction hash.
 * @param logIndex - The log index.
 * @param actionIndex - The action index.
 * @returns A concatenated ID string for the Transfer entity.
 */
export function generateTransferEntityId(
  txHash: Bytes,
  logIndex: BigInt,
  actionIndex: i32
): string {
  const ids = [
    txHash.toHexString(),
    logIndex.toString(),
    actionIndex.toString(),
  ];
  return ids.join('_');
}
