import {InvalidAddressError} from './errors';
import {Interface} from '@ethersproject/abi';
import {isAddress} from '@ethersproject/address';
import {BigNumber} from '@ethersproject/bignumber';
import {Contract} from '@ethersproject/contracts';
import {JsonRpcProvider} from '@ethersproject/providers';

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
 * @param {string} rpc
 * @param {string} contractAddress
 * @return {*}  {Promise<[number, number, number]>}
 */
export async function getProtocolVersion(
  rpc: string,
  contractAddress: string
): Promise<[number, number, number]> {
  if (!isAddress(contractAddress)) {
    throw new InvalidAddressError(contractAddress);
  }
  const provider = new JsonRpcProvider(rpc);
  const iface = new Interface([
    'function protocolVersion() public pure returns (uint8[3] memory)',
  ]);
  const contract = new Contract(contractAddress, iface, provider);
  let version: [number, number, number];
  try {
    version = await contract.protocolVersion();
  } catch (e) {
    // ethers5 throws a call exception error which could mean a lot of things
    // so this is not accurate
    version = [1, 0, 0];
  }
  return version;
}
