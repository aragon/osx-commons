import {
  DAOMock,
  DAOMock__factory,
  IERC1822ProxiableUpgradeable__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginUUPSUpgradeableMockBuild1,
  PluginUUPSUpgradeableMockBuild1__factory,
  PluginUUPSUpgradeableMockBuild2__factory,
  PluginUUPSUpgradeableMockBad__factory,
  ProxyFactory__factory,
} from '../../typechain';
import {
  ProxyCreatedEvent,
  ProxyFactory,
} from '../../typechain/src/utils/deployment/ProxyFactory';
import {erc165ComplianceTests, getOzInitializedSlotValue} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {
  findEvent,
  getInterfaceId,
  PLUGIN_UUPS_UPGRADEABLE_PERMISSIONS,
  PluginType,
  PROXY_FACTORY_EVENTS,
} from '@aragon/osx-commons-sdk';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

type FixtureResult = {
  deployer: SignerWithAddress;
  implementation: PluginUUPSUpgradeableMockBuild1;
  proxyFactory: ProxyFactory;
  daoMock: DAOMock;
  initCalldata: string;
  Build1Factory: PluginUUPSUpgradeableMockBuild1__factory;
  Build2Factory: PluginUUPSUpgradeableMockBuild2__factory;
};

async function fixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const Build1Factory = new PluginUUPSUpgradeableMockBuild1__factory(deployer);
  const Build2Factory = new PluginUUPSUpgradeableMockBuild2__factory(deployer);
  const daoMock = await new DAOMock__factory(deployer).deploy();

  const implementation = await Build1Factory.deploy();

  const proxyFactory = await new ProxyFactory__factory(deployer).deploy(
    implementation.address
  );

  const initCalldata = implementation.interface.encodeFunctionData(
    'initialize',
    [daoMock.address]
  );

  return {
    deployer,
    implementation,
    proxyFactory,
    initCalldata,
    daoMock,
    Build1Factory,
    Build2Factory,
  };
}

describe('PluginUUPSUpgradeable', function () {
  describe('Initializable', async () => {
    it('initialize', async () => {
      const {proxyFactory, Build1Factory, daoMock} = await loadFixture(fixture);

      // Deploy an uninitialized proxy
      const tx = await proxyFactory.deployUUPSProxy([]);
      const event = await findEvent<ProxyCreatedEvent>(
        tx,
        PROXY_FACTORY_EVENTS.ProxyCreated
      );
      const proxy = Build1Factory.attach(event.args.proxy);

      // Check the clone before initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, proxy.address)
      ).to.equal(0);
      expect(await proxy.dao()).to.equal(ethers.constants.AddressZero);
      expect(await proxy.state1()).to.equal(0);

      // Initialize the clone
      await proxy.initialize(daoMock.address);

      // Check the clone after initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, proxy.address)
      ).to.equal(1);
      expect(await proxy.dao()).to.equal(daoMock.address);
      expect(await proxy.state1()).to.equal(1);
    });

    it('disables initializers for the implementation', async () => {
      const {implementation} = await loadFixture(fixture);

      // Check that the implementation is uninitialized.
      expect(await implementation.dao()).to.equal(ethers.constants.AddressZero);
      expect(await implementation.state1()).to.equal(0);

      // Check that the implementation initialization is disabled.
      expect(
        await getOzInitializedSlotValue(ethers.provider, implementation.address)
      ).to.equal(255);
    });

    it('reverts if an function tries to call `__PluginUUPSUpgradeable_init` without being an initializer', async () => {
      const {deployer, daoMock} = await loadFixture(fixture);

      const badPlugin = await new PluginUUPSUpgradeableMockBad__factory(
        deployer
      ).deploy();
      await expect(
        badPlugin.notAnInitializer(daoMock.address)
      ).to.be.revertedWith('Initializable: contract is not initializing');
    });
  });

  describe('PluginType', async () => {
    it('returns the current protocol version', async () => {
      const {implementation} = await loadFixture(fixture);
      expect(await implementation.pluginType()).to.equal(PluginType.UUPS);
    });
  });

  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      const {implementation} = await loadFixture(fixture);
      expect(await implementation.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {deployer, implementation} = await loadFixture(fixture);
      await erc165ComplianceTests(implementation, deployer);
    });

    it('supports the `IPlugin` interface', async () => {
      const {implementation} = await loadFixture(fixture);
      const iface = IPlugin__factory.createInterface();
      expect(await implementation.supportsInterface(getInterfaceId(iface))).to
        .be.true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const {implementation} = await loadFixture(fixture);
      const iface = IProtocolVersion__factory.createInterface();
      expect(await implementation.supportsInterface(getInterfaceId(iface))).to
        .be.true;
    });

    it('supports the `IERC1822ProxiableUpgradeable` interface', async () => {
      const {implementation} = await loadFixture(fixture);
      const iface = IERC1822ProxiableUpgradeable__factory.createInterface();
      expect(await implementation.supportsInterface(getInterfaceId(iface))).to
        .be.true;
    });
  });

  describe('Protocol version', async () => {
    it('returns the current protocol version', async () => {
      const {implementation} = await loadFixture(fixture);
      expect(await implementation.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  describe('Upgradeability', async () => {
    it('returns the implementation', async () => {
      const {proxyFactory, Build1Factory, implementation} = await loadFixture(
        fixture
      );

      // Deploy an uninitialized build 1 proxy
      const tx = await proxyFactory.deployUUPSProxy([]);
      const event = await findEvent<ProxyCreatedEvent>(
        tx,
        PROXY_FACTORY_EVENTS.ProxyCreated
      );
      const proxy = Build1Factory.attach(event.args.proxy);

      expect(await proxy.implementation()).to.equal(implementation.address);
    });

    it('reverts the upgrade if caller caller does not have the `UPGRADE_PLUGIN_PERMISSION_ID` permission on the plugin proxy', async () => {
      const {
        deployer,
        proxyFactory,
        initCalldata,
        Build1Factory,
        Build2Factory,
        daoMock,
      } = await loadFixture(fixture);

      // Deploy an initialized build 1 proxy
      const tx = await proxyFactory.deployUUPSProxy(initCalldata);
      const event = await findEvent<ProxyCreatedEvent>(
        tx,
        PROXY_FACTORY_EVENTS.ProxyCreated
      );
      const proxy = Build1Factory.attach(event.args.proxy);

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
      const {
        proxyFactory,
        initCalldata,
        Build1Factory,
        Build2Factory,
        daoMock,
      } = await loadFixture(fixture);

      // Create an initialized build 1 proxy
      const tx = await proxyFactory.deployUUPSProxy(initCalldata);
      const event = await findEvent<ProxyCreatedEvent>(
        tx,
        PROXY_FACTORY_EVENTS.ProxyCreated
      );
      const proxy = Build1Factory.attach(event.args.proxy);

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
      const {
        proxyFactory,
        initCalldata,
        Build1Factory,
        Build2Factory,
        daoMock,
      } = await loadFixture(fixture);

      // Deploy an initialized build 1 proxy
      const tx = await proxyFactory.deployUUPSProxy(initCalldata);
      const event = await findEvent<ProxyCreatedEvent>(
        tx,
        PROXY_FACTORY_EVENTS.ProxyCreated
      );
      const proxy = Build1Factory.attach(event.args.proxy);

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
