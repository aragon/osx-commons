import {
  IPluginSetup__factory,
  IProtocolVersion__factory,
  PluginCloneableSetupMockBuild1,
  PluginCloneableSetupMockBuild1__factory,
  PluginUUPSUpgradeableMockBuild1,
  PluginUUPSUpgradeableMockBuild1__factory,
  PluginUUPSUpgradeableSetupMockBuild1__factory,
} from '../../../typechain';
import {erc165ComplianceTests} from '../../helpers';
import {osxCommonsContractsVersion} from '../../utils/versioning/protocol-version';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IPluginSetup__factory as IPluginSetup_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('IPluginSetup', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(IPluginSetup__factory.createInterface());
    const initial = getInterfaceId(
      IPluginSetup_V1_0_0__factory.createInterface()
    );
    expect(current).to.equal(initial);
  });
});

describe('PluginSetup', async () => {
  permissionConditionBaseTests(pluginSetupFixture);
});

describe('PluginUUPSUpgradeableSetup', async () => {
  permissionConditionBaseTests(pluginUUPSUpgradeableSetupFixture);
});

function permissionConditionBaseTests(
  fixture: () => Promise<PluginSetupFixtureInput>
) {
  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      const {pluginSetupMock} = await loadFixture(fixture);
      expect(await pluginSetupMock.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {deployer, pluginSetupMock} = await loadFixture(fixture);
      await erc165ComplianceTests(pluginSetupMock, deployer);
    });

    it('supports the `IPluginSetup` interface', async () => {
      const {pluginSetupMock} = await loadFixture(fixture);
      const iface = IPluginSetup__factory.createInterface();
      expect(await pluginSetupMock.supportsInterface(getInterfaceId(iface))).to
        .be.true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const {pluginSetupMock} = await loadFixture(fixture);
      const iface = IProtocolVersion__factory.createInterface();
      expect(await pluginSetupMock.supportsInterface(getInterfaceId(iface))).to
        .be.true;
    });
  });
}

type PluginSetupFixtureInput = {
  deployer: SignerWithAddress;
  pluginSetupMock:
    | PluginCloneableSetupMockBuild1
    | PluginUUPSUpgradeableMockBuild1;
};

async function pluginSetupFixture(): Promise<PluginSetupFixtureInput> {
  const [deployer] = await ethers.getSigners();
  const pluginSetupMock = await new PluginCloneableSetupMockBuild1__factory(
    deployer
  ).deploy();
  return {deployer, pluginSetupMock};
}

async function pluginUUPSUpgradeableSetupFixture(): Promise<PluginSetupFixtureInput> {
  const [deployer] = await ethers.getSigners();
  const pluginSetupMock =
    await new PluginUUPSUpgradeableSetupMockBuild1__factory(deployer).deploy();
  return {deployer, pluginSetupMock};
}
