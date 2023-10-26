import {Address, BigInt} from '@graphprotocol/graph-ts';

/**
 * Generates the balance entity ID using the dao Address and the token Address in hexadecimal format.
 *
 * @param dao - The address of the DAO.
 * @param token - The address of the token.
 * @returns An unique ID based on the DAO and token's address.
 */
export function generateBalanceEntityId(dao: Address, token: Address): string {
  const ids = [dao.toHexString(), token.toHexString()];
  return ids.join('_');
}

/**
 * Generates the balance entity ID using the dao Address and the token Address in hexadecimal format and the token index .
 *
 * @param dao - The address of the DAO.
 * @param token - The address of the token.
 * @param tokenId - the token index.
 * @returns An unique ID based on the DAO, token's address and token index.
 */
export function generateTokenIdBalanceEntityId(
  dao: Address,
  token: Address,
  tokenId: BigInt
): string {
  const ids = [dao.toHexString(), token.toHexString(), tokenId.toString()];
  return ids.join('_');
}
