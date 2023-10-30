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
  const ids = [dao.toHexString(), interfaceId.toHexString()];
  return ids.join('_');
}
