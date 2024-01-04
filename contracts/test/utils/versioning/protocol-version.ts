import {version} from '../../../package.json';
import {ProtocolVersion__factory} from '../../../typechain';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

/**
 * Returns the NPM version number from the `osx-commons-contracts` package.json file
 */
export function osxCommonsContractsNPMVersion(): [number, number, number] {
  const trimmedVersion = version.split('-')[0];
  const semver = trimmedVersion.split('.');
  return [Number(semver[0]), Number(semver[1]), Number(semver[2])];
}

describe('ProtocolVersion', function () {
  let signers: SignerWithAddress[];
  before(async () => {
    signers = await ethers.getSigners();
  });

  it('returns the current protocol version that must match the semantic version of the `osx-commons-contracts` package', async () => {
    const versionedContract = await new ProtocolVersion__factory(
      signers[0]
    ).deploy();
    expect(await versionedContract.protocolVersion()).to.deep.equal(
      osxCommonsContractsNPMVersion()
    );
  });
});
