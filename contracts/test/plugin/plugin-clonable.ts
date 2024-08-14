import {
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

      let interfaceId = ethers.BigNumber.from(iface.getSighash('setTarget'))
        .xor(ethers.BigNumber.from(iface.getSighash('getTarget')))
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

  describe('setTarget/getTarget', async () => {
    it('reverts if caller does not have the permission', async () => {
      const {deployer, proxy, daoMock} = await loadFixture(fixture);

      let newTarget = proxy.address;

      await expect(proxy.setTarget(newTarget))
        .to.be.revertedWithCustomError(proxy, 'DaoUnauthorized')
        .withArgs(
          daoMock.address,
          proxy.address,
          deployer.address,
          ethers.utils.id('SET_TARGET_PERMISSION')
        );
    });

    it('updates the target and emits an appropriate event', async () => {
      const {proxy, daoMock} = await loadFixture(fixture);

      // Set the `hasPermission` mock function to return `true`.
      await daoMock.setHasPermissionReturnValueMock(true); // answer true for all permission requests

      let newTarget = proxy.address;

      await expect(proxy.setTarget(newTarget))
        .to.emit(proxy, 'TargetSet')
        .withArgs(ethers.constants.AddressZero, newTarget);

      expect(await proxy.getTarget()).to.equal(newTarget);
    });
  });

  describe('Executions', async () => {
    describe('execute with current target', async () => {
      it('reverts with ambiguity if target is not set', async () => {
        const {proxy, daoMock} = await loadFixture(fixture);

        await expect(
          proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](1, [], 0)
        ).to.be.reverted;
      });

      it('successfully forwards action to the currently set target', async () => {
        const {proxy, daoMock} = await loadFixture(fixture);

        await daoMock.setHasPermissionReturnValueMock(true);
        await proxy.setTarget(daoMock.address);

        await expect(
          proxy['execute(uint256,(address,uint256,bytes)[],uint256)'](1, [], 0)
        ).to.emit(daoMock, 'Executed');
      });
    });

    describe('execute with the custom target', async () => {
      it('reverts with ambiguity if target address(0) is passed', async () => {
        const {proxy, daoMock} = await loadFixture(fixture);

        await expect(
          proxy['execute(address,uint256,(address,uint256,bytes)[],uint256)'](
            ethers.constants.AddressZero,
            1,
            [],
            0
          )
        ).to.be.reverted;
      });

      it('successfully forwards action to the currently set target', async () => {
        const {proxy, daoMock} = await loadFixture(fixture);

        await expect(
          proxy['execute(address,uint256,(address,uint256,bytes)[],uint256)'](
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
