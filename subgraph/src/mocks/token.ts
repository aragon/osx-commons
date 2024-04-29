import {createMockGetter} from './utils';
import {Address, ethereum, BigInt} from '@graphprotocol/graph-ts';
import {createMockedFunction} from 'matchstick-as';

/**
 * Create common mocks for tokens with name and symbol getters.
 *
 * @export
 * @param {string} tokenAddress
 * @param {string} [name='Mock Token']
 * @param {string} [symbol='MT']
 */
export function createTokenCalls(
  tokenAddress: string,
  name: string = 'Mock Token',
  symbol: string = 'MT'
): void {
  createMockGetter(tokenAddress, 'name', 'name():(string)', [
    ethereum.Value.fromString(name),
  ]);

  createMockGetter(tokenAddress, 'symbol', 'symbol():(string)', [
    ethereum.Value.fromString(symbol),
  ]);
}

/**
 * Create common mocks for ERC20 tokens with name, symbol, decimals, and totalSupply getters.
 *
 * @export
 * @param {string} tokenAddress
 * @param {string} totalSupply
 * @param {string} [name='Mock Token']
 * @param {string} [symbol='MT']
 * @param {string} [decimals='18']
 */
export function createERC20TokenCalls(
  tokenAddress: string,
  totalSupply: string,
  name: string = 'Mock Token',
  symbol: string = 'MT',
  decimals: string = '18'
): void {
  createTokenCalls(tokenAddress, name, symbol);
  createMockGetter(tokenAddress, 'decimals', 'decimals():(uint8)', [
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(decimals)),
  ]);
  createMockGetter(tokenAddress, 'totalSupply', 'totalSupply():(uint256)', [
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(totalSupply)),
  ]);
}
/**
 * Create common mocks for wrapped ERC20 tokens with name, symbol, decimals, totalSupply, and underlying getters.
 *
 * @export
 * @param {string} tokenAddress
 * @param {string} underlyingTokenAddress
 * @param {string} totalSupply
 * @param {string} [name='Mock Token']
 * @param {string} [symbol='MT']
 * @param {string} [decimals='18']
 */
export function createWrappedERC20TokenCalls(
  tokenAddress: string,
  underlyingTokenAddress: string,
  totalSupply: string,
  name: string = 'Mock Token',
  symbol: string = 'MT',
  decimals: string = '18'
): void {
  createERC20TokenCalls(tokenAddress, totalSupply, name, symbol, decimals);
  createMockGetter(tokenAddress, 'underlying', 'underlying():(address)', [
    ethereum.Value.fromAddress(Address.fromString(underlyingTokenAddress)),
  ]);
}

/**
 * Create common mocks for ERC1155 tokens with URI getters.
 *
 * @export
 * @param {string} contractAddress
 * @param {string} tokenId
 * @param {string} uri
 */
export function createERC1155TokenCalls(
  contractAddress: string,
  tokenId: string,
  uri: string
): void {
  createMockedFunction(
    Address.fromString(contractAddress),
    'uri',
    'uri(uint256):(string)'
  )
    .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromString(tokenId))])
    .returns([ethereum.Value.fromString(uri)]);
}

/**
 * Create common mocks for ERC721 tokens with name, symbol, and URI getters.
 *
 * @export
 * @param {string} tokenAddress
 * @param {number} tokenId
 * @param {string} uri
 * @param {string} [name='Mock Token']
 * @param {string} [symbol='MT']
 */
export function createERC721TokenCalls(
  tokenAddress: string,
  tokenId: number,
  uri: string,
  name: string = 'Mock Token',
  symbol: string = 'MT'
): void {
  createTokenCalls(tokenAddress, name, symbol);
  createMockedFunction(
    Address.fromString(tokenAddress),
    'tokenURI',
    'tokenURI(uint256):(string)'
  )
    .withArgs([ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(tokenId))])
    .returns([ethereum.Value.fromString(uri)]);
}
