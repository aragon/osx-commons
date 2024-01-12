import {
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginMockBuild1,
  PluginMockBuild1__factory,
} from '../../typechain';
import {erc165ComplianceTests} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {getInterfaceId, PluginType} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('Plugin', function () {
  let deployer: SignerWithAddress;
  let plugin: PluginMockBuild1;

  before(async () => {
    [deployer] = await ethers.getSigners();
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
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(plugin, deployer);
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
