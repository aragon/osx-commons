import {ethers as ethersDirect} from 'ethers';
import {ethers} from 'hardhat';

export function getInterfaceId(
  contractInterface: ethersDirect.utils.Interface
) {
  let interfaceID = ethers.constants.Zero;
  const functions: string[] = Object.keys(contractInterface.functions);
  for (let i = 0; i < functions.length; i++) {
    interfaceID = interfaceID.xor(contractInterface.getSighash(functions[i]));
  }
  return interfaceID.toHexString();
}
