import {
  DAOMock,
  DAOMock__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginMockBuild1,
  PluginMockBuild1__factory,
} from '../../typechain';
import {erc165ComplianceTests} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {getInterfaceId, PluginType} from '@aragon/osx-commons-sdk';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

type FixtureResult = {
  deployer: SignerWithAddress;
  plugin: PluginMockBuild1;
  daoMock: DAOMock;
  Build1Factory: PluginMockBuild1__factory;
};

async function fixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const Build1Factory = new PluginMockBuild1__factory(deployer);
  const daoMock = await new DAOMock__factory(deployer).deploy();

  const plugin = await Build1Factory.deploy(daoMock.address);

  return {
    deployer,
    plugin,
    daoMock,
    Build1Factory,
  };
}

describe('Plugin', function () {
  describe('PluginType', async () => {
    it('returns the current protocol version', async () => {
      const {plugin} = await loadFixture(fixture);
      expect(await plugin.pluginType()).to.equal(PluginType.Constructable);
    });
  });

  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      const {plugin} = await loadFixture(fixture);
      expect(await plugin.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {deployer, plugin} = await loadFixture(fixture);
      await erc165ComplianceTests(plugin, deployer);
    });

    it('supports the `IPlugin` interface', async () => {
      const {plugin} = await loadFixture(fixture);
      const iface = IPlugin__factory.createInterface();
      expect(await plugin.supportsInterface(getInterfaceId(iface))).to.be.true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const {plugin} = await loadFixture(fixture);
      const iface = IProtocolVersion__factory.createInterface();
      expect(await plugin.supportsInterface(getInterfaceId(iface))).to.be.true;
    });
  });

  describe('Protocol version', async () => {
    const {plugin} = await loadFixture(fixture);
    it('returns the current protocol version', async () => {
      expect(await plugin.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });
});
