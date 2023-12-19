import {Interface} from '@ethersproject/abi';
import {Zero} from '@ethersproject/constants';

/**
 * Gets the interfaceId of a given interface
 *
 * @export
 * @param {Interface} iface
 * @return {*}  {string}
 */
export function getInterfaceId(iface: Interface): string {
  let interfaceId = Zero;
  const functions: string[] = Object.keys(iface.functions);
  for (const func of functions) {
    interfaceId = interfaceId.xor(iface.getSighash(func));
  }
  return interfaceId.toHexString();
}
