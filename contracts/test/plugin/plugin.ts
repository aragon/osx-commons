import {
  IERC165__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginMockBuild1,
  PluginMockBuild1__factory,
} from '../../typechain';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {getInterfaceId, PluginType} from '@aragon/osx-commons-sdk';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('Plugin', function () {
  let plugin: PluginMockBuild1;

  before(async () => {
    const deployer = (await ethers.getSigners())[0];
    plugin = await new PluginMockBuild1__factory(deployer).deploy(
      ethers.constants.AddressZero
    );
  });

  describe('Plugin Type', async () => {
    it('returns the current protocol version', async () => {
      expect(await plugin.pluginType()).to.equal(PluginType.Constructable);
    });
  });

  describe('ERC-165', async () => {
    it('does not support the empty interface', async () => {
      expect(await plugin.supportsInterface('0xffffffff')).to.be.false;
    });

    it('supports the `IERC165` interface', async () => {
      const iface = IERC165__factory.createInterface();
      expect(await plugin.supportsInterface(getInterfaceId(iface))).to.be.true;
    });

    it('supports the `IPlugin` interface', async () => {
      const iface = IPlugin__factory.createInterface();
      expect(await plugin.supportsInterface(getInterfaceId(iface))).to.be.true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const iface = IProtocolVersion__factory.createInterface();
      expect(await plugin.supportsInterface(getInterfaceId(iface))).to.be.true;
    });
  });

  describe('Protocol version', async () => {
    it('returns the current protocol version', async () => {
      expect(await plugin.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });
});
