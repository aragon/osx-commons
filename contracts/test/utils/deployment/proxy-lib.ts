import {
  PluginCloneableMockBuild1,
  PluginCloneableMockBuild1__factory,
  PluginUUPSUpgradeableMockBuild1,
  PluginUUPSUpgradeableMockBuild1__factory,
  ProxyFactory,
  ProxyFactory__factory,
} from '../../../typechain';
import {ProxyCreatedEvent} from '../../../typechain/src/utils/deployment/ProxyFactory';
import {findEvent} from '@aragon/osx-commons-sdk';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

const ADDRESS_ZERO = `0x${'0'.repeat(40)}`;
const ADDRESS_LAST = `0x${'f'.repeat(40)}`;

describe('ProxyFactory', function () {
  describe('deployUUPSProxy', function () {
    it('deploys an initialized proxy if initialization data is provided', async () => {
      const {
        deployer,
        proxyFactory,
        implementation,
        initCalldata,
        daoMockAddr,
      } = await loadFixture(uupsProxyFixture);

      // Deploy the proxy with initialization data
      const tx = await proxyFactory.deployUUPSProxy(initCalldata);

      // Get the proxy address from the event
      const event = findEvent<ProxyCreatedEvent>(
        await tx.wait(),
        'ProxyCreated'
      );
      const proxy = PluginUUPSUpgradeableMockBuild1__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy and proxy factory both point to the implementation contract.
      expect(await proxy.implementation())
        .to.equal(await proxyFactory.implementation())
        .to.equal(implementation.address);

      // Check that the proxy is initialized
      expect(await proxy.dao()).to.equal(daoMockAddr);
      expect(await proxy.state1()).to.equal(1);
    });

    it('deploys an uninitialized proxy if no initialization data is provided', async () => {
      const {deployer, proxyFactory, implementation} = await loadFixture(
        uupsProxyFixture
      );

      // Deploy the proxy without initialization data
      const tx = await proxyFactory.deployUUPSProxy([]);

      // Get the proxy address from the event
      const event = await findEvent<ProxyCreatedEvent>(
        await tx.wait(),
        'ProxyCreated'
      );
      const proxy = PluginUUPSUpgradeableMockBuild1__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy and proxy factory both point to the implementation contract.
      expect(await proxy.implementation())
        .to.equal(await proxyFactory.implementation())
        .to.equal(implementation.address);

      // Check that the proxy is not initialized
      expect(await proxy.dao()).to.equal(ADDRESS_ZERO);
      expect(await proxy.state1()).to.equal(0);
    });
  });

  describe('deployMinimalProxy', function () {
    it('deploys an initialized proxy if initialization data is provided', async () => {
      const {deployer, proxyFactory, initCalldata, daoMockAddr} =
        await loadFixture(minimalProxyFixture);

      // Deploy the proxy with initialization data
      const tx = await proxyFactory.deployMinimalProxy(initCalldata);

      // Get the proxy address from the event
      const event = findEvent<ProxyCreatedEvent>(
        await tx.wait(),
        'ProxyCreated'
      );
      const proxy = PluginCloneableMockBuild1__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy is initialized
      expect(await proxy.dao()).to.equal(daoMockAddr);
      expect(await proxy.state1()).to.equal(1);
    });

    it('deploys an uninitialized proxy if no initialization data is provided', async () => {
      const {deployer, proxyFactory} = await loadFixture(minimalProxyFixture);

      // Deploy the proxy without initialization data
      const tx = await proxyFactory.deployMinimalProxy([]);

      // Get the proxy address from the event
      const event = await findEvent<ProxyCreatedEvent>(
        await tx.wait(),
        'ProxyCreated'
      );
      const proxy = PluginCloneableMockBuild1__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy is not initialized
      expect(await proxy.dao()).to.equal(ADDRESS_ZERO);
      expect(await proxy.state1()).to.equal(0);
    });
  });
});

type FixtureResult = {
  deployer: SignerWithAddress;
  implementation: PluginUUPSUpgradeableMockBuild1 | PluginCloneableMockBuild1;
  proxyFactory: ProxyFactory;
  daoMockAddr: string;
  initCalldata: string;
};

async function uupsProxyFixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const implementation = await new PluginUUPSUpgradeableMockBuild1__factory(
    deployer
  ).deploy();

  const proxyFactory = await new ProxyFactory__factory(deployer).deploy(
    implementation.address
  );

  // Create a mock address with a valid checksum
  const daoMockAddr = ethers.utils.getAddress(ADDRESS_LAST);

  const initCalldata = implementation.interface.encodeFunctionData(
    'initialize',
    [daoMockAddr]
  );

  return {deployer, implementation, proxyFactory, daoMockAddr, initCalldata};
}

async function minimalProxyFixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const implementation = await new PluginCloneableMockBuild1__factory(
    deployer
  ).deploy();

  const proxyFactory = await new ProxyFactory__factory(deployer).deploy(
    implementation.address
  );

  // Create a mock address with a valid checksum
  const daoMockAddr = ethers.utils.getAddress(ADDRESS_LAST);

  const initCalldata = implementation.interface.encodeFunctionData(
    'initialize',
    [daoMockAddr]
  );

  return {deployer, implementation, proxyFactory, daoMockAddr, initCalldata};
}
