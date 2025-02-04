import {
  CustomExecutorMock,
  CustomExecutorMock__factory,
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

enum Operation {
  call,
  delegatecall,
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

    it('supports the `setTarget^getTarget` interface', async () => {
      const {plugin} = await loadFixture(fixture);
      const iface = PluginMockBuild1__factory.createInterface();

      const interfaceId = ethers.BigNumber.from(
        iface.getSighash('setTargetConfig')
      )
        .xor(ethers.BigNumber.from(iface.getSighash('getTargetConfig')))
        .xor(ethers.BigNumber.from(iface.getSighash('getCurrentTargetConfig')))
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

  describe('setTargetConfig/getTargetConfig/getCurrentTargetConfig', async () => {
    it('reverts if caller does not have the permission', async () => {
      const {deployer, plugin, daoMock} = await loadFixture(fixture);

      const newTarget = plugin.address;

      await expect(plugin.setTargetConfig({target: newTarget, operation: 0}))
        .to.be.revertedWithCustomError(plugin, 'DaoUnauthorized')
        .withArgs(
          daoMock.address,
          plugin.address,
          deployer.address,
          ethers.utils.id('SET_TARGET_CONFIG_PERMISSION')
        );
    });

    it('updates the target and emits an appropriate event', async () => {
      const {plugin, daoMock} = await loadFixture(fixture);

      const newTarget = plugin.address;

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      expect(await plugin.getCurrentTargetConfig()).to.deep.equal([
        ethers.constants.AddressZero,
        0,
      ]);

      const targetConfig = {target: newTarget, operation: 0};

      await expect(plugin.setTargetConfig(targetConfig))
        .to.emit(plugin, 'TargetSet')
        .withArgs((val: any) =>
          expect(val).to.deep.equal([
            targetConfig.target,
            targetConfig.operation,
          ])
        );

      expect(await plugin.getTargetConfig()).to.deep.equal([
        targetConfig.target,
        targetConfig.operation,
      ]);

      expect(await plugin.getCurrentTargetConfig()).to.deep.equal([
        targetConfig.target,
        targetConfig.operation,
      ]);
    });

    it('returns default target config if no target config is set', async () => {
      const {plugin, daoMock} = await loadFixture(fixture);

      const dao = await plugin.dao();

      // Current Config must return zeroes.
      expect(await plugin.getCurrentTargetConfig()).to.deep.equal([
        ethers.constants.AddressZero,
        0,
      ]);

      // Since no target is set, it must return default - i.e dao target.
      expect(await plugin.getTargetConfig()).to.deep.equal([dao, 0]);

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      const newTargetConfig = {target: plugin.address, operation: 1};

      await plugin.setTargetConfig(newTargetConfig);

      // Current config must return the newly set one.
      expect(await plugin.getCurrentTargetConfig()).to.deep.equal([
        newTargetConfig.target,
        newTargetConfig.operation,
      ]);

      // new config was set, so it must return the new one.
      expect(await plugin.getTargetConfig()).to.deep.equal([
        newTargetConfig.target,
        newTargetConfig.operation,
      ]);

      // set the zero target which should then return default again - i.e dao.
      await plugin.setTargetConfig({
        target: ethers.constants.AddressZero,
        operation: 0,
      });

      expect(await plugin.getTargetConfig()).to.deep.equal([dao, 0]);
    });
  });

  describe('Executions', async () => {
    let executor: CustomExecutorMock;
    let plugin: PluginMockBuild1;
    let daoMock: DAOMock;
    let mergedABI: any;
    before(async () => {
      const [deployer] = await ethers.getSigners();

      const executorFactory = new CustomExecutorMock__factory(deployer);
      executor = await executorFactory.deploy();

      const abiA = CustomExecutorMock__factory.abi;
      const abiB = PluginMockBuild1__factory.abi;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mergedABI = abiA.concat(abiB);
    });

    beforeEach(async () => {
      const data = await fixture();
      const [deployer] = await ethers.getSigners();

      plugin = new ethers.Contract(
        data.plugin.address,
        mergedABI,
        deployer
      ) as PluginMockBuild1;
      daoMock = data.daoMock;

      await daoMock.setHasPermissionReturnValueMock(true);
    });

    describe('execute with current target', async () => {
      it('executes on the dao if target is not set', async () => {
        await expect(
          plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](1, [], 0)
        ).to.emit(daoMock, 'Executed');
      });

      describe('Execute with operation = `call`', async () => {
        it('successfully forwards action to the currently set target and reverts from target', async () => {
          await plugin.setTargetConfig({
            target: executor.address,
            operation: Operation.call,
          });
          await expect(
            plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](
              0,
              [],
              0
            )
          ).to.be.revertedWithCustomError(executor, 'Failed');
        });

        it('successfully forwards action to the currently set target and emits event from target', async () => {
          await plugin.setTargetConfig({
            target: executor.address,
            operation: Operation.call,
          });
          await expect(
            plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](
              1,
              [],
              0
            )
          ).to.emit(executor, 'Executed');
        });
      });

      describe('Execute with operation = `delegatecall`', async () => {
        it('bubbles up the revert message and reverts from the consumer', async () => {
          await plugin.setTargetConfig({
            target: executor.address,
            operation: Operation.delegatecall,
          });
          await expect(
            plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](
              0,
              [],
              0
            )
          ).to.be.revertedWithCustomError(plugin, 'Failed');
        });

        it('successfully does `delegatecall` and emits the event from the consumer', async () => {
          await plugin.setTargetConfig({
            target: executor.address,
            operation: Operation.delegatecall,
          });
          // Must emit the event from the consumer, not from the executor because of delegatecall
          await expect(
            plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](
              1,
              [],
              0
            )
          ).to.emit(plugin, 'Executed');
        });

        it('reverts with `DelegateCallFailed` error', async () => {
          await plugin.setTargetConfig({
            target: executor.address,
            operation: Operation.delegatecall,
          });
          await expect(
            plugin['execute(uint256,(address,uint256,bytes)[],uint256)'](
              123,
              [],
              0
            )
          ).to.be.revertedWithCustomError(plugin, 'DelegateCallFailed');
        });
      });
    });

    describe('execute with the custom target', async () => {
      it('reverts with ambiguity if target address(0) is passed', async () => {
        await expect(
          plugin[
            'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
          ](ethers.constants.AddressZero, 1, [], 0, 0)
        ).to.be.reverted;
      });

      describe('Execute with operation = `call`', async () => {
        it('successfully forwards action to the currently set target and emits event from target', async () => {
          await expect(
            plugin[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 0, [], 0, 0)
          ).to.be.revertedWithCustomError(executor, 'Failed');
        });

        it('successfully forwards action to the currently set target and reverts from target', async () => {
          await expect(
            plugin[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 1, [], 0, 0)
          ).to.emit(executor, 'Executed');
        });
      });

      describe('Execute with operation = `delegatecall`', async () => {
        it('bubbles up the revert message and reverts from the consumer', async () => {
          await expect(
            plugin[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 0, [], 0, Operation.delegatecall)
          ).to.be.revertedWithCustomError(plugin, 'Failed');
        });

        it('successfully does `delegatecall` and emits the event from the consumer', async () => {
          // Must emit the event from the consumer, not from the executor because of delegatecall
          await expect(
            plugin[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 1, [], 0, Operation.delegatecall)
          ).to.emit(plugin, 'Executed');
        });

        it('reverts with `DelegateCallFailed` error', async () => {
          await expect(
            plugin[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 123, [], 0, Operation.delegatecall)
          ).to.be.revertedWithCustomError(plugin, 'DelegateCallFailed');
        });
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
