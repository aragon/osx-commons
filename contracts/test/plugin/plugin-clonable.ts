import {
  CloneFactory__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginCloneableMockBuild1,
  PluginCloneableMockBuild1__factory,
} from '../../typechain';
import {erc165ComplianceTests, getOzInitializedSlotValue} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {getInterfaceId, PluginType} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('PluginCloneable', function () {
  let deployer: SignerWithAddress;
  let plugin: PluginCloneableMockBuild1;

  before(async () => {
    [deployer] = await ethers.getSigners();
    plugin = await new PluginCloneableMockBuild1__factory(deployer).deploy();
  });

  describe('Initializable', async () => {
    it('initialize', async () => {
      // Deploy a clone
      const cloneFactory = await new CloneFactory__factory(deployer).deploy(
        plugin.address
      );
      const expectedAddress = await cloneFactory.callStatic.deployClone();
      await cloneFactory.deployClone();
      const clone = new PluginCloneableMockBuild1__factory(deployer).attach(
        expectedAddress
      );

      // Check the clone before initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, clone.address)
      ).to.equal(0);
      expect(await clone.dao()).to.equal(ethers.constants.AddressZero);
      expect(await clone.state1()).to.equal(0);

      // Initialize the clone
      const dummyDaoAddress = plugin.address;
      await clone.initialize(dummyDaoAddress);

      // Check the clone after initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, clone.address)
      ).to.equal(1);
      expect(await clone.dao()).to.equal(dummyDaoAddress);
      expect(await clone.state1()).to.equal(1);
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
