import {Interface} from '@ethersproject/abi';
import {BigNumber} from '@ethersproject/bignumber';
import {Contract} from '@ethersproject/contracts';
import {ErrorCode} from '@ethersproject/logger';

// The protocol version number of contracts not having a `getProtocolVersion()` function because they don't inherit from `ProtocolVersion.sol` yet.
export const IMPLICIT_INITIAL_PROTOCOL_VERSION: [number, number, number] = [
  1, 0, 0,
];

/**
 * Gets the interfaceId of a given interface
 *
 * @export
 * @param {Interface} iface
 * @return {*}  {string}
 */
export function getInterfaceId(iface: Interface): string {
  let interfaceId = BigNumber.from(0);
  const functions: string[] = Object.keys(iface.functions);
  for (const func of functions) {
    interfaceId = interfaceId.xor(iface.getSighash(func));
  }
  return interfaceId.toHexString();
}

/**
 * Gets the protocol version of a contract, if the contract does not have a
 * protocolVersion function, it will return [1, 0, 0]
 *
 * @export
 * @param {Contract} contract
 * @return {*}  {Promise<[number, number, number]>}
 */
export async function getProtocolVersion(
  contract: Contract
): Promise<[number, number, number]> {
  let protocolVersion: [number, number, number];
  try {
    contract.interface.getFunction('protocolVersion');
    protocolVersion = await contract.protocolVersion();
  } catch (e) {
    if ((e as any).code === ErrorCode.INVALID_ARGUMENT) {
      return IMPLICIT_INITIAL_PROTOCOL_VERSION;
    }
    throw e;
  }
  return protocolVersion;
}

/**
 * Enum for PluginType
 * Reference: https://github.com/aragon/osx-commons/blob/ffa6b45fab9ec067d4bed3b81f5097f03861b876/contracts/src/plugin/IPlugin.sol
 *
 * @export
 * @enum {number}
 */
export enum PluginType {
  UUPS = 0,
  Cloneable = 1,
  Constructable = 2,
}
