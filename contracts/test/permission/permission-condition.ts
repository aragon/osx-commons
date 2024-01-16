import {
  IPermissionCondition__factory,
  IProtocolVersion__factory,
  PermissionConditionMock,
  PermissionConditionMock__factory,
} from '../../typechain';
import {erc165ComplianceTests} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IPermissionCondition__factory as IPermissionCondition_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('IProposal', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(
      IPermissionCondition__factory.createInterface()
    );
    const initial = getInterfaceId(
      IPermissionCondition_V1_0_0__factory.createInterface()
    );
    expect(current).to.equal(initial);
  });
});

describe('PermissionCondition', async () => {
  let condition: PermissionConditionMock;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();
    condition = await new PermissionConditionMock__factory(deployer).deploy();
  });

  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      expect(await condition.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(condition, deployer);
    });

    it('supports the `IPermissionCondition` interface', async () => {
      const iface = IPermissionCondition__factory.createInterface();
      expect(await condition.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const iface = IProtocolVersion__factory.createInterface();
      expect(await condition.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });
});

describe.skip('PermissionConditionUpgradeable', async () => {
  // TODO run the same tests as for `PermissionCondition`.

  it('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});
