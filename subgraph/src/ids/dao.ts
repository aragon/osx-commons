import {Address} from '@graphprotocol/graph-ts';

/**
 * Generates the DAO's ID using its address in hexadecimal format.
 *
 * @param dao - The address of the DAO.
 * @returns A hexadecimal string representation of the provided DAO address.
 */
export function getDaoId(dao: Address): string {
  return dao.toHexString();
}

// TODO: this is not complete, it will be done in it's own task.
