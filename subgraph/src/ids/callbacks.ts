import {generateEntityIdFromAddress, generateEntityIdFromBytes} from './ids';
import {Address, Bytes} from '@graphprotocol/graph-ts';

/**
 * Generates a unique StandardCallback ID using the given parameters.
 *
 * @param dao - Address of the DAO
 * @param interfaceId - Interface ID of the emitted event
 * @returns A concatenated ID string for the StandardCallback entity.
 */
export function generateStandardCallbackEntityId(
  dao: Address,
  interfaceId: Bytes
): string {
  return [
    generateEntityIdFromAddress(dao),
    generateEntityIdFromBytes(interfaceId),
  ].join('_');
}
