import {bigIntToBytes32} from '../utils/utils';
import {
  generateEntityIdFromAddress,
  generateEntityIdFromBigInt,
  generateEntityIdFromBytes,
} from './ids';
import {Address, BigInt, Bytes} from '@graphprotocol/graph-ts';

/**
 * Generates a unique action ID using the given parameters.
 *
 * @param proposalId - The id of the proposal that the action belongs to.
 * @param index - The index of the action within the proposal.
 * @returns A concatenated ID string for the Action entity.
 */
export function generateActionEntityId(
  proposalEntityId: string,
  index: i32
): string {
  return [proposalEntityId, index.toString()].join('_');
}

/**
 * Generates a unique identifier for a transaction action proposal entity.
 * @param proposalEntityId - The ID of the proposal entity.
 * @param txHash - The hash of the transaction.
 * @param logIndex - The index of the log.
 * @returns A string representing the unique identifier for the transaction action proposal entity.
 */
export function generateTransactionActionsProposalEntityId(
  proposalEntityId: string,
  txHash: Bytes,
  logIndex: BigInt
): string {
  return [
    proposalEntityId,
    generateEntityIdFromBytes(txHash),
    generateEntityIdFromBigInt(logIndex),
  ].join('_');
}

/**
 * Generates an entity ID for a proposal.
 * @param plugin - The address of the plugin that created the proposal.
 * @param proposalId - The ID of the proposal.
 * @returns The generated entity ID.
 */
export function generateProposalEntityId(
  plugin: Address,
  proposalId: BigInt
): string {
  return [
    generateEntityIdFromAddress(plugin),
    bigIntToBytes32(proposalId),
  ].join('_');
}
