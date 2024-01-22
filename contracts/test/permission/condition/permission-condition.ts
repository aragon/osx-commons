import {
  IPermissionCondition__factory,
  IProtocolVersion__factory,
  PermissionConditionMock,
  PermissionConditionMock__factory,
  PermissionConditionUpgradeableMock,
  PermissionConditionUpgradeableMock__factory,
} from '../../../typechain';
import {erc165ComplianceTests} from '../../helpers';
import {osxCommonsContractsVersion} from '../../utils/versioning/protocol-version';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IPermissionCondition__factory as IPermissionCondition_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
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
  permissionConditionBaseTests(permissionConditionFixture);
});

describe('PermissionConditionUpgradeable', async () => {
  permissionConditionBaseTests(permissionConditionUpgradeableFixture);
});

function permissionConditionBaseTests(fixture: () => Promise<FixtureResult>) {
  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      const {conditionMock} = await loadFixture(fixture);
      expect(await conditionMock.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {deployer, conditionMock} = await loadFixture(fixture);
      await erc165ComplianceTests(conditionMock, deployer);
    });

    it('supports the `IPermissionCondition` interface', async () => {
      const {conditionMock} = await loadFixture(fixture);
      const iface = IPermissionCondition__factory.createInterface();
      expect(await conditionMock.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const {conditionMock} = await loadFixture(fixture);
      const iface = IProtocolVersion__factory.createInterface();
      expect(await conditionMock.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });
}

type FixtureResult = {
  deployer: SignerWithAddress;
  conditionMock: PermissionConditionMock | PermissionConditionUpgradeableMock;
};

async function permissionConditionFixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();
  const conditionMock = await new PermissionConditionMock__factory(
    deployer
  ).deploy();

  return {deployer, conditionMock};
}

async function permissionConditionUpgradeableFixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();
  const conditionMock = await new PermissionConditionUpgradeableMock__factory(
    deployer
  ).deploy();

  return {deployer, conditionMock};
}
