import {
  IPluginSetup__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginCloneableSetupMockBuild1,
  PluginCloneableSetupMockBuild1__factory,
  PluginUUPSUpgradeableSetupMockBuild1,
  PluginUUPSUpgradeableSetupMockBuild1__factory,
  PluginUUPSUpgradeableSetupMockBuild2__factory,
} from '../../../typechain';
import {IPluginSetup} from '../../../typechain/src/plugin/setup/PluginSetup';
import {erc165ComplianceTests} from '../../helpers';
import {osxCommonsContractsVersion} from '../../utils/versioning/protocol-version';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {
  IPluginSetup__factory as IPluginSetup_V1_0_0__factory,
  Plugin__factory,
} from '@aragon/osx-ethers-v1.0.0';
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

const ADDRESS_ZERO = `0x${'0'.repeat(40)}`;
const ADDRESS_ONE = `0x${'0'.repeat(39)}1`;
const ADDRESS_TWO = `0x${'0'.repeat(39)}2`;

describe('PluginSetup', async () => {
  pluginSetupBaseTests(pluginSetupFixture);

  describe('prepareUpdate', async () => {
    it('reverts when called', async () => {
      const {pluginSetupMock} = await loadFixture(pluginSetupFixture);

      const dummyDaoAddr = ADDRESS_ONE;
      const dummyPluginAddr = ADDRESS_TWO;
      const dummyFromBuildNumber = 123;
      const setupPayload: IPluginSetup.SetupPayloadStruct = {
        plugin: dummyPluginAddr,
        currentHelpers: [],
        data: [],
      };

      await expect(
        pluginSetupMock.prepareUpdate(
          dummyDaoAddr,
          dummyFromBuildNumber,
          setupPayload
        )
      )
        .to.be.revertedWithCustomError(pluginSetupMock, 'NonUpgradeablePlugin')
        .withArgs();
    });
  });
});

describe('PluginUpgradeableSetup', async () => {
  pluginSetupBaseTests(pluginUUPSUpgradeableSetupFixture);

  describe('prepareUpdate', async () => {
    it('should revert when called on the initial build 1', async () => {
      const {pluginSetupMock: setupBuild1} = await loadFixture(
        pluginUUPSUpgradeableSetupFixture
      );

      const dummyDaoAddr = ADDRESS_ONE;
      const dummyPluginAddr = ADDRESS_TWO;
      const setupPayload: IPluginSetup.SetupPayloadStruct = {
        plugin: dummyPluginAddr,
        currentHelpers: [],
        data: [],
      };

      const fromBuildNumber = 0;
      const thisBuildNumber = 1;

      await expect(
        setupBuild1.prepareUpdate(dummyDaoAddr, fromBuildNumber, setupPayload)
      )
        .to.be.revertedWithCustomError(
          setupBuild1 as PluginUUPSUpgradeableSetupMockBuild1,
          'InvalidUpdatePath'
        )
        .withArgs(fromBuildNumber, thisBuildNumber);
    });

    it('can be called on builds that are not the initial build', async () => {
      const {deployer} = await loadFixture(pluginSetupFixture);
      const setupBuild2 =
        await new PluginUUPSUpgradeableSetupMockBuild2__factory(
          deployer
        ).deploy();

      const dummyDaoAddr = ADDRESS_ONE;
      const dummyPluginAddr = ADDRESS_TWO;
      const dummyFromBuildNumber = 123;
      const setupPayload: IPluginSetup.SetupPayloadStruct = {
        plugin: dummyPluginAddr,
        currentHelpers: [],
        data: [],
      };

      await expect(
        setupBuild2.prepareUpdate(
          dummyDaoAddr,
          dummyFromBuildNumber,
          setupPayload
        )
      ).to.be.not.reverted;
    });
  });
});

function pluginSetupBaseTests(fixture: () => Promise<FixtureResult>) {
  it('returns the implementation contract', async () => {
    const {deployer, pluginSetupMock} = await loadFixture(fixture);

    const implementation = await pluginSetupMock.implementation();

    // Check that an address is returned
    expect(implementation).to.not.equal(ADDRESS_ZERO);

    // Check that it supports the `IPlugin` interface
    const plugin = Plugin__factory.connect(implementation, deployer);
    const IPluginInterfaceId = getInterfaceId(
      IPlugin__factory.createInterface()
    );
    expect(await plugin.supportsInterface(IPluginInterfaceId));
  });

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

type FixtureResult = {
  deployer: SignerWithAddress;
  pluginSetupMock:
    | PluginCloneableSetupMockBuild1
    | PluginUUPSUpgradeableSetupMockBuild1;
};

async function pluginSetupFixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();
  const pluginSetupMock = await new PluginCloneableSetupMockBuild1__factory(
    deployer
  ).deploy();
  return {deployer, pluginSetupMock};
}

async function pluginUUPSUpgradeableSetupFixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();
  const pluginSetupMock =
    await new PluginUUPSUpgradeableSetupMockBuild1__factory(deployer).deploy();
  return {deployer, pluginSetupMock};
}
