import {version} from '../../../package.json';
import {
  IProtocolVersion__factory,
  ProtocolVersionMock__factory,
} from '../../../typechain';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IProtocolVersion__factory as IProtocolVersion_V1_3_0__factory} from '@aragon/osx-ethers-v1.3.0';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

/**
 * Returns the NPM version number from the `osx-commons-contracts` package.json file
 */
export function osxCommonsContractsVersion(): [number, number, number] {
  const trimmedVersion = version.split('-')[0];
  const semver = trimmedVersion.split('.');
  return [Number(semver[0]), Number(semver[1]), Number(semver[2])];
}

describe('IProtocolVersion', function () {
  it('has the same interface ID as its initial version introduced in v1.3.0', async () => {
    const current = getInterfaceId(IProtocolVersion__factory.createInterface());
    const initial = getInterfaceId(
      IProtocolVersion_V1_3_0__factory.createInterface()
    );
    expect(current).to.equal(initial);
  });
});

describe('ProtocolVersion', function () {
  let deployer: SignerWithAddress;
  before(async () => {
    [deployer] = await ethers.getSigners();
  });

  it('returns the current protocol version that must match the semantic version of the `osx-commons-contracts` package', async () => {
    const ProtocolVersionMock = await new ProtocolVersionMock__factory(
      deployer
    ).deploy();
    expect(await ProtocolVersionMock.protocolVersion()).to.deep.equal(
      osxCommonsContractsVersion()
    );
  });
});
