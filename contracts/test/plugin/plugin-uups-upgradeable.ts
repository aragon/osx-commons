import {
  IERC1822ProxiableUpgradeable__factory,
  IPlugin__factory,
  DAOMock__factory,
  IProtocolVersion__factory,
  PluginUUPSUpgradeableMockBuild1,
  PluginUUPSUpgradeableMockBuild1__factory,
  PluginUUPSUpgradeableMockBuild2__factory,
} from '../../typechain';
import {erc165ComplianceTests, getOzInitializedSlotValue} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {
  getInterfaceId,
  PLUGIN_UUPS_UPGRADEABLE_PERMISSIONS,
  PluginType,
} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers, upgrades} from 'hardhat';

describe('PluginUUPSUpgradeable', function () {
  let Build1Factory: PluginUUPSUpgradeableMockBuild1__factory;
  let Build2Factory: PluginUUPSUpgradeableMockBuild2__factory;
  let DAOMockFactory: DAOMock__factory;

  let plugin: PluginUUPSUpgradeableMockBuild1;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();

    Build1Factory = new PluginUUPSUpgradeableMockBuild1__factory(deployer);
    Build2Factory = new PluginUUPSUpgradeableMockBuild2__factory(deployer);
    DAOMockFactory = new DAOMock__factory(deployer);

    plugin = await Build1Factory.deploy();
  });

  describe('Initializable', async () => {
    it('initialize', async () => {
      // Deploy a proxy
      const proxy = await upgrades.deployProxy(Build1Factory, [], {
        kind: 'uups',
        initializer: false, // DO NOT USE THIS CODE IN PRODUCTION. This deploys an initialized proxy.
        unsafeAllow: ['constructor'],
        constructorArgs: [],
      });

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

  describe('Upgradeability', async () => {
    it('returns the implementation', async () => {
      const dummyDaoAddress = ethers.constants.AddressZero;

      const predeployedImplementation = await upgrades.deployImplementation(
        Build1Factory
      );

      const proxy = await upgrades.deployProxy(
        Build1Factory,
        [dummyDaoAddress],
        {
          useDeployedImplementation: true,
          kind: 'uups',
          initializer: 'initialize',
          unsafeAllow: ['constructor'],
          constructorArgs: [],
        }
      );

      expect(await proxy.implementation()).to.equal(predeployedImplementation);
    });

    it('reverts the upgrade if caller caller does not have the `UPGRADE_PLUGIN_PERMISSION_ID` permission on the plugin proxy', async () => {
      const daoMock = await DAOMockFactory.deploy();

      // Deploy a build 1 proxy
      const proxy = await upgrades.deployProxy(
        Build1Factory,
        [daoMock.address],
        {
          kind: 'uups',
          initializer: 'initialize',
          unsafeAllow: ['constructor'],
          constructorArgs: [],
        }
      );

      // Deploy the build 2 implementation
      const newImplementation = await Build2Factory.deploy();

      // Check that the `hasPermission` mock function is set to return `false`.
      expect(await daoMock.hasPermissionReturnValueMock()).to.be.false;

      // Check that the upgrade reverts
      await expect(proxy.upgradeTo(newImplementation.address))
        .to.be.revertedWithCustomError(proxy, 'DaoUnauthorized')
        .withArgs(
          daoMock.address,
          proxy.address,
          deployer.address,
          PLUGIN_UUPS_UPGRADEABLE_PERMISSIONS.UPGRADE_PLUGIN_PERMISSION_ID
        );
    });

    it('upgrades if the caller has the `UPGRADE_PLUGIN_PERMISSION_ID` permission', async () => {
      const daoMock = await DAOMockFactory.deploy();

      // Create a build 1 proxy
      const proxy = await upgrades.deployProxy(
        Build1Factory,
        [daoMock.address],
        {
          kind: 'uups',
          initializer: 'initialize',
          unsafeAllow: ['constructor'],
          constructorArgs: [],
        }
      );

      // Deploy the build 2 implementation
      const newImplementation = await Build2Factory.deploy();

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      // Upgrade build 1 to build 2.
      await proxy.upgradeTo(newImplementation.address);

      // Expect the new proxy to be not re-initialized
      expect(
        await getOzInitializedSlotValue(ethers.provider, proxy.address)
      ).to.equal(1);

      // Expect the new state variable `state2` that was added in build 2 to be not initialized.
      expect(await Build2Factory.attach(proxy.address).state2()).to.equal(0);
    });

    it('can be reinitialzed', async () => {
      const daoMock = await DAOMockFactory.deploy();

      // Deploy a build 1 proxy
      const proxy = await upgrades.deployProxy(
        Build1Factory,
        [daoMock.address],
        {
          kind: 'uups',
          initializer: 'initialize',
          unsafeAllow: ['constructor'],
          constructorArgs: [],
        }
      );

      // Deploy the build 2 implementation
      const newImplementation = await Build2Factory.deploy();
      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      // Prepare the calldate to call `initializeFrom(uint16 _previousBuild)`
      const build1 = 1; // The build number of build 1
      const initializeFromCalldata =
        newImplementation.interface.encodeFunctionData('initializeFrom', [
          build1,
        ]);

      // Upgrade and call `initializeFrom`
      await proxy.upgradeToAndCall(
        newImplementation.address,
        initializeFromCalldata
      );

      // Expect the new proxy to be not re-initialized
      expect(
        await getOzInitializedSlotValue(ethers.provider, proxy.address)
      ).to.equal(2);

      // Expect the new state variable `state2` that was added in build 2 to be not initialized.
      expect(await Build2Factory.attach(proxy.address).state2()).to.equal(2);
    });
  });
});
