import {generateEntityIdFromAddress} from './ids';
import {Address} from '@graphprotocol/graph-ts';

/**
 * Generates the DAO's EntityId using its address in hexadecimal format.
 *
 * @param dao - The address of the DAO.
 * @returns A hexadecimal string representation of the provided DAO address.
 */
export function generateDaoEntityId(dao: Address): string {
  return generateEntityIdFromAddress(dao);
}

// TODO: this is not complete, it will be done in it's own task.
