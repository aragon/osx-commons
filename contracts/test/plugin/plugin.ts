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

    it('supports the `setTarget^getTarget` interface', async () => {
      const {plugin} = await loadFixture(fixture);
      const iface = PluginMockBuild1__factory.createInterface();

      let interfaceId = ethers.BigNumber.from(iface.getSighash('setTarget'))
        .xor(ethers.BigNumber.from(iface.getSighash('getTarget')))
        .toHexString();

      expect(await plugin.supportsInterface(interfaceId)).to.be.true;
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

  describe('setTarget', async () => {
    it('reverts if caller does not have the permission', async () => {
      const {deployer, plugin, daoMock} = await loadFixture(fixture);

      let newTarget = plugin.address;

      await expect(plugin.setTarget(newTarget))
        .to.be.revertedWithCustomError(plugin, 'DaoUnauthorized')
        .withArgs(
          daoMock.address,
          plugin.address,
          deployer.address,
          ethers.utils.id('SET_TARGET_PERMISSION')
        );
    });

    it('updates the target and emits an appropriate event', async () => {
      const {plugin, daoMock} = await loadFixture(fixture);

      let newTarget = plugin.address;

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      await expect(plugin.setTarget(newTarget))
        .to.emit(plugin, 'TargetSet')
        .withArgs(ethers.constants.AddressZero, newTarget);

      expect(await plugin.getTarget()).to.equal(newTarget);
    });
  });

  describe('Executions', async () => {
    describe('execute with current target', async () => {
      it('reverts with ambiguity if target is not set', async () => {
        const {plugin, daoMock} = await loadFixture(fixture);

        await expect(
          plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](1, [], 0)
        ).to.be.reverted;
      });

      it('successfully forwards action to the currently set target', async () => {
        const {plugin, daoMock} = await loadFixture(fixture);

        await daoMock.setHasPermissionReturnValueMock(true);
        await plugin.setTarget(daoMock.address);

        await expect(
          plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](1, [], 0)
        ).to.emit(daoMock, 'Executed');
      });
    });

    describe('execute with the custom target', async () => {
      it('reverts with ambiguity if target address(0) is passed', async () => {
        const {plugin, daoMock} = await loadFixture(fixture);

        await expect(
          plugin['execute(address,uint256,(address,uint256,bytes)[],uint256)'](
            ethers.constants.AddressZero,
            1,
            [],
            0
          )
        ).to.be.reverted;
      });

      it('successfully forwards action to the currently set target', async () => {
        const {plugin, daoMock} = await loadFixture(fixture);

        await expect(
          plugin['execute(address,uint256,(address,uint256,bytes)[],uint256)'](
            daoMock.address,
            1,
            [],
            0
          )
        ).to.emit(daoMock, 'Executed');
      });
    });
  });
});

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
