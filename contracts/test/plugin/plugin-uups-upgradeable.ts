import {
  IERC1822ProxiableUpgradeable__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginUUPSUpgradeableMockBuild1,
  PluginUUPSUpgradeableMockBuild1__factory,
} from '../../typechain';
import {erc165ComplianceTests, getOzInitializedSlotValue} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {getInterfaceId, PluginType} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers, upgrades} from 'hardhat';

describe('PluginUUPSUpgradeable', function () {
  let plugin: PluginUUPSUpgradeableMockBuild1;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();
    plugin = await new PluginUUPSUpgradeableMockBuild1__factory(
      deployer
    ).deploy();
  });

  describe('Initializable', async () => {
    it('initialize', async () => {
      // Deploy a proxy
      const proxy = await upgrades.deployProxy(
        new PluginUUPSUpgradeableMockBuild1__factory(deployer),
        [],
        {
          kind: 'uups',
          initializer: false, // DO NOT USE THIS CODE IN PRODUCTION. This deploys an initialized proxy.
          unsafeAllow: ['constructor'],
          constructorArgs: [],
        }
      );

      // Check the clone before initialization

      expect(
        await getOzInitializedSlotValue(ethers.provider, proxy.address)
      ).to.equal(0);
      expect(await proxy.dao()).to.equal(ethers.constants.AddressZero);
      expect(await proxy.state1()).to.equal(0);

      // Initialize the clone
      const dummyDaoAddress = plugin.address;
      await proxy.initialize(dummyDaoAddress);

      // Check the clone after initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, proxy.address)
      ).to.equal(1);
      expect(await proxy.dao()).to.equal(dummyDaoAddress);
      expect(await proxy.state1()).to.equal(1);
    });
  });

  describe('PluginType', async () => {
    it('returns the current protocol version', async () => {
      expect(await plugin.pluginType()).to.equal(PluginType.UUPS);
    });
  });

  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      expect(await plugin.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
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

    it('supports the `IERC1822ProxiableUpgradeable` interface', async () => {
      const iface = IERC1822ProxiableUpgradeable__factory.createInterface();
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

  describe('UUPSUpgradeable', async () => {
    it('returns the implementation', async () => {
      const dummyDaoAddress = ethers.constants.AddressZero;

      const factory = new PluginUUPSUpgradeableMockBuild1__factory(deployer);
      const predeployedImplementation = await upgrades.deployImplementation(
        factory
      );

      const proxy = await upgrades.deployProxy(factory, [dummyDaoAddress], {
        useDeployedImplementation: true,
        kind: 'uups',
        initializer: 'initialize',
        unsafeAllow: ['constructor'],
        constructorArgs: [],
      });

      expect(await proxy.implementation()).to.equal(predeployedImplementation);
    });
  });
});
