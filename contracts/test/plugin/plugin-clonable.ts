import {
  CustomExecutorMock,
  CustomExecutorMock__factory,
  DAOMock,
  DAOMock__factory,
  IPlugin__factory,
  IProtocolVersion__factory,
  PluginCloneableMockBad__factory,
  PluginCloneableMockBuild1,
  PluginCloneableMockBuild1__factory,
  ProxyFactory__factory,
} from '../../typechain';
import {
  ProxyCreatedEvent,
  ProxyFactory,
} from '../../typechain/src/utils/deployment/ProxyFactory';
import {erc165ComplianceTests, getOzInitializedSlotValue} from '../helpers';
import {osxCommonsContractsVersion} from '../utils/versioning/protocol-version';
import {PluginType, findEvent, getInterfaceId} from '@aragon/osx-commons-sdk';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

enum Operation {
  call,
  delegatecall,
}

describe('PluginCloneable', function () {
  describe('Initializable', async () => {
    it('initialize', async () => {
      const {proxyFactory, Build1Factory, daoMock} = await loadFixture(fixture);

      // Deploy an uninitialized clone
      const tx = await proxyFactory.deployMinimalProxy([]);
      const event = findEvent<ProxyCreatedEvent>(
        await tx.wait(),
        'ProxyCreated'
      );
      const clone = Build1Factory.attach(event.args.proxy);

      // Check the clone before initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, clone.address)
      ).to.equal(0);
      expect(await clone.dao()).to.equal(ethers.constants.AddressZero);
      expect(await clone.state1()).to.equal(0);

      await clone.initialize(daoMock.address);

      // Check the clone after initialization
      expect(
        await getOzInitializedSlotValue(ethers.provider, clone.address)
      ).to.equal(1);
      expect(await clone.dao()).to.equal(daoMock.address);
      expect(await clone.state1()).to.equal(1);
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

    it('reverts if an function tries to call `__PluginCloneable_init` without being an initializer', async () => {
      const {deployer, daoMock} = await loadFixture(fixture);

      const badPlugin = await new PluginCloneableMockBad__factory(
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
      expect(await implementation.pluginType()).to.equal(PluginType.Cloneable);
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

    it('supports the `setTarget^getTarget` interface', async () => {
      const {implementation} = await loadFixture(fixture);
      const iface = PluginCloneableMockBuild1__factory.createInterface();

      const interfaceId = ethers.BigNumber.from(
        iface.getSighash('setTargetConfig')
      )
        .xor(ethers.BigNumber.from(iface.getSighash('getTargetConfig')))
        .xor(ethers.BigNumber.from(iface.getSighash('getCurrentTargetConfig')))
        .toHexString();

      expect(await implementation.supportsInterface(interfaceId)).to.be.true;
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

  describe('setTargetConfig/getTargetConfig/getCurrentTargetConfig', async () => {
    it('reverts if caller does not have the permission', async () => {
      const {deployer, proxy, daoMock} = await loadFixture(fixture);

      const newTarget = proxy.address;

      await expect(proxy.setTargetConfig({target: newTarget, operation: 0}))
        .to.be.revertedWithCustomError(proxy, 'DaoUnauthorized')
        .withArgs(
          daoMock.address,
          proxy.address,
          deployer.address,
          ethers.utils.id('SET_TARGET_CONFIG_PERMISSION')
        );
    });

    it('updates the target and emits an appropriate event', async () => {
      const {proxy, daoMock} = await loadFixture(fixture);

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      const newTarget = proxy.address;

      const targetConfig = {target: newTarget, operation: 0};

      expect(await proxy.getCurrentTargetConfig()).to.deep.equal([
        ethers.constants.AddressZero,
        0,
      ]);

      await expect(proxy.setTargetConfig(targetConfig))
        .to.emit(proxy, 'TargetSet')
        .withArgs((val: any) =>
          expect(val).to.deep.equal([
            targetConfig.target,
            targetConfig.operation,
          ])
        );

      expect(await proxy.getTargetConfig()).to.deep.equal([
        targetConfig.target,
        targetConfig.operation,
      ]);

      expect(await proxy.getCurrentTargetConfig()).to.deep.equal([
        targetConfig.target,
        targetConfig.operation,
      ]);
    });

    it('returns default target config if no target config is set', async () => {
      const {proxy, daoMock} = await loadFixture(fixture);

      const dao = await proxy.dao();

      // Current Config must return zeroes.
      expect(await proxy.getCurrentTargetConfig()).to.deep.equal([
        ethers.constants.AddressZero,
        0,
      ]);

      // Since no target is set, it must return default - i.e dao target.
      expect(await proxy.getTargetConfig()).to.deep.equal([dao, 0]);

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      const newTargetConfig = {target: proxy.address, operation: 1};

      await proxy.setTargetConfig(newTargetConfig);

      // Current config must return the newly set one.
      expect(await proxy.getCurrentTargetConfig()).to.deep.equal([
        newTargetConfig.target,
        newTargetConfig.operation,
      ]);

      // new config was set, so it must return the new one.
      expect(await proxy.getTargetConfig()).to.deep.equal([
        newTargetConfig.target,
        newTargetConfig.operation,
      ]);

      // set the zero target which should then return default again - i.e dao.
      await proxy.setTargetConfig({
        target: ethers.constants.AddressZero,
        operation: 0,
      });

      expect(await proxy.getTargetConfig()).to.deep.equal([dao, 0]);
    });
  });

  describe('Executions', async () => {
    let executor: CustomExecutorMock;
    let proxy: PluginCloneableMockBuild1;
    let daoMock: DAOMock;
    let mergedABI: any;
    before(async () => {
      const [deployer] = await ethers.getSigners();

      const executorFactory = new CustomExecutorMock__factory(deployer);
      executor = await executorFactory.deploy();

      const abiA = CustomExecutorMock__factory.abi;
      const abiB = PluginCloneableMockBuild1__factory.abi;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      mergedABI = abiA.concat(abiB);
    });

    beforeEach(async () => {
      const data = await fixture();
      const [deployer] = await ethers.getSigners();

      proxy = new ethers.Contract(
        data.proxy.address,
        mergedABI,
        deployer
      ) as PluginCloneableMockBuild1;
      daoMock = data.daoMock;

      await daoMock.setHasPermissionReturnValueMock(true);
    });

    describe('execute with current target', async () => {
      it('executes on the dao if target is not set', async () => {
        await expect(
          proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](1, [], 0)
        ).to.emit(daoMock, 'Executed');
      });

      describe('Execute with operation = `call`', async () => {
        it('successfully forwards action to the currently set target and reverts from target', async () => {
          await proxy.setTargetConfig({
            target: executor.address,
            operation: Operation.call,
          });
          await expect(
            proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](
              0,
              [],
              0
            )
          ).to.be.revertedWithCustomError(executor, 'Failed');
        });

        it('successfully forwards action to the currently set target and emits event from target', async () => {
          await proxy.setTargetConfig({
            target: executor.address,
            operation: Operation.call,
          });
          await expect(
            proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](
              1,
              [],
              0
            )
          ).to.emit(executor, 'Executed');
        });
      });

      describe('Execute with operation = `delegatecall`', async () => {
        it('bubbles up the revert message and reverts from the consumer', async () => {
          await proxy.setTargetConfig({
            target: executor.address,
            operation: Operation.delegatecall,
          });
          await expect(
            proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](
              0,
              [],
              0
            )
          ).to.be.revertedWithCustomError(proxy, 'Failed');
        });

        it('successfully does `delegatecall` and emits the event from the consumer', async () => {
          await proxy.setTargetConfig({
            target: executor.address,
            operation: Operation.delegatecall,
          });
          // Must emit the event from the consumer, not from the executor because of delegatecall
          await expect(
            proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](
              1,
              [],
              0
            )
          ).to.emit(proxy, 'Executed');
        });

        it('reverts with `DelegateCallFailed` error', async () => {
          await proxy.setTargetConfig({
            target: executor.address,
            operation: Operation.delegatecall,
          });
          await expect(
            proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](
              123,
              [],
              0
            )
          ).to.be.revertedWithCustomError(proxy, 'DelegateCallFailed');
        });
      });
    });

    describe('execute with the custom target', async () => {
      it('reverts with ambiguity if target address(0) is passed', async () => {
        await expect(
          proxy[
            'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
          ](ethers.constants.AddressZero, 1, [], 0, 0)
        ).to.be.reverted;
      });

      describe('Execute with operation = `call`', async () => {
        it('successfully forwards action to the currently set target and emits event from target', async () => {
          await expect(
            proxy[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 0, [], 0, 0)
          ).to.be.revertedWithCustomError(executor, 'Failed');
        });

        it('successfully forwards action to the currently set target and reverts from target', async () => {
          await expect(
            proxy[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 1, [], 0, 0)
          ).to.emit(executor, 'Executed');
        });
      });

      describe('Execute with operation = `delegatecall`', async () => {
        it('bubbles up the revert message and reverts from the consumer', async () => {
          await expect(
            proxy[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 0, [], 0, Operation.delegatecall)
          ).to.be.revertedWithCustomError(proxy, 'Failed');
        });

        it('successfully does `delegatecall` and emits the event from the consumer', async () => {
          // Must emit the event from the consumer, not from the executor because of delegatecall
          await expect(
            proxy[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 1, [], 0, Operation.delegatecall)
          ).to.emit(proxy, 'Executed');
        });

        it('reverts with `DelegateCallFailed` error', async () => {
          await expect(
            proxy[
              'execute(address,uint256,(address,uint256,bytes)[],uint256,uint8)'
            ](executor.address, 123, [], 0, Operation.delegatecall)
          ).to.be.revertedWithCustomError(proxy, 'DelegateCallFailed');
        });
      });
    });
  });
});

type FixtureResult = {
  deployer: SignerWithAddress;
  implementation: PluginCloneableMockBuild1;
  proxyFactory: ProxyFactory;
  proxy: PluginCloneableMockBuild1;
  daoMock: DAOMock;
  initCalldata: string;
  Build1Factory: PluginCloneableMockBuild1__factory;
};

async function fixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const Build1Factory = new PluginCloneableMockBuild1__factory(deployer);
  const daoMock = await new DAOMock__factory(deployer).deploy();

  const implementation = await Build1Factory.deploy();

  const proxyFactory = await new ProxyFactory__factory(deployer).deploy(
    implementation.address
  );

  const initCalldata = implementation.interface.encodeFunctionData(
    'initialize',
    [daoMock.address]
  );

  const tx = await proxyFactory.deployUUPSProxy(initCalldata);
  const event = findEvent<ProxyCreatedEvent>(await tx.wait(), 'ProxyCreated');
  const proxy = Build1Factory.attach(event.args.proxy);

  return {
    deployer,
    implementation,
    proxyFactory,
    proxy,
    daoMock,
    initCalldata,
    Build1Factory,
  };
}
