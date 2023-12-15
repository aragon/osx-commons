import {Address, ethereum} from '@graphprotocol/graph-ts';
import {createMockedFunction} from 'matchstick-as/assembly';

/**
 * Creates a mock function for a contract's getter function.
 *
 * @export
 * @param {string} contractAddress
 * @param {string} funcName
 * @param {string} funcSignature
 * @param {ethereum.Value[]} returns
 */
export function createMockGetter(
  contractAddress: string,
  funcName: string,
  funcSignature: string,
  returns: ethereum.Value[]
): void {
  createMockedFunction(
    Address.fromString(contractAddress),
    funcName,
    funcSignature
  )
    .withArgs([])
    .returns(returns);
}
