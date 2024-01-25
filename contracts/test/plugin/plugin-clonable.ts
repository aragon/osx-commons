import {
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginCloneableMockBad__factory,
  PluginCloneableMockBuild1,
  PluginCloneableMockBuild1__factory,
  ProxyFactory__factory,
} from '../../typechain';
import {ProxyCreatedEvent} from '../../typechain/src/utils/deployment/ProxyFactory';
import {erc165ComplianceTests, getOzInitializedSlotValue} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {
  ADDRESS,
  findEvent,
  getInterfaceId,
  PluginType,
  PROXY_FACTORY_EVENTS,
} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('PluginCloneable', function () {
  const dummyDaoAddress = ADDRESS.ONE;
  let deployer: SignerWithAddress;
  let plugin: PluginCloneableMockBuild1;
  let Build1Factory: PluginCloneableMockBuild1__factory;

  before(async () => {
    [deployer] = await ethers.getSigners();
    Build1Factory = new PluginCloneableMockBuild1__factory(deployer);
    plugin = await Build1Factory.deploy();
  });

  describe('Initializable', async () => {
    it('initialize', async () => {
      // Deploy a proxy factory
      const proxyFactory = await new ProxyFactory__factory(deployer).deploy(
        plugin.address
      );

      // Deploy an uninitialized clone
      const tx = await proxyFactory.deployMinimalProxy([]);
      const event = await findEvent<ProxyCreatedEvent>(
        tx,
        PROXY_FACTORY_EVENTS.ProxyCreated
      );
      const clone = Build1Factory.attach(event.args.proxy);

      // Check the clone before initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, clone.address)
      ).to.equal(0);
      expect(await clone.dao()).to.equal(ethers.constants.AddressZero);
      expect(await clone.state1()).to.equal(0);

      await clone.initialize(dummyDaoAddress);

      // Check the clone after initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, clone.address)
      ).to.equal(1);
      expect(await clone.dao()).to.equal(dummyDaoAddress);
      expect(await clone.state1()).to.equal(1);
    });

    it('disables initializers for the implementation', async () => {
      // Deploy the implementation contract
      const implementation = await new PluginCloneableMockBuild1__factory(
        deployer
      ).deploy();

      // Check that the implementation is uninitialized.
      expect(await implementation.dao()).to.equal(ethers.constants.AddressZero);
      expect(await implementation.state1()).to.equal(0);

      // Check that the implementation initialization is disabled.

      expect(
        await getOzInitializedSlotValue(ethers.provider, implementation.address)
      ).to.equal(255);
    });

    it('reverts if an function tries to call `__PluginCloneable_init` without being an initializer', async () => {
      const badPlugin = await new PluginCloneableMockBad__factory(
        deployer
      ).deploy();
      const dummyDaoAddr = ADDRESS.ONE;
      await expect(badPlugin.notAnInitializer(dummyDaoAddr)).to.be.revertedWith(
        'Initializable: contract is not initializing'
      );
    });
  });

  describe('PluginType', async () => {
    it('returns the current protocol version', async () => {
      expect(await plugin.pluginType()).to.equal(PluginType.Cloneable);
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
  });

  describe('Protocol version', async () => {
    it('returns the current protocol version', async () => {
      expect(await plugin.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });
});
