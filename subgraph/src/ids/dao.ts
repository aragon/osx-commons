import {Address} from '@graphprotocol/graph-ts';

/**
 * Generates the DAO's ID using its address in hexadecimal format.
 *
 * @param daoAddress - The address of the DAO.
 * @returns A hexadecimal string representation of the provided DAO address.
 */
export function getDaoId(daoAddress: Address): string {
  return daoAddress.toHexString();
}
