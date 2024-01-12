import {IERC165__factory} from '../typechain';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {Contract} from 'ethers';

export async function erc165ComplianceTests(
  contract: Contract,
  signer: SignerWithAddress
) {
  const erc165Contract = IERC165__factory.connect(contract.address, signer);
  const erc165InterfaceId = getInterfaceId(IERC165__factory.createInterface());
  const emptyInterfaceId = '0xffffffff';

  expect(await erc165Contract.supportsInterface(erc165InterfaceId)).to.be.true;
  expect(await erc165Contract.supportsInterface(emptyInterfaceId)).to.be.false;
}
