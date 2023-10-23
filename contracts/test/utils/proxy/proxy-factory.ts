import {
  ProxyFactory,
  ProxyFactory__factory,
  TestGovernanceERC20,
  TestGovernanceERC20__factory,
} from '../../../typechain';
import {ProxyCreatedEvent} from '../../../typechain/src/utils/ProxyFactory';
import {findEvent} from '../../../utils/helpers';
import {
  ERC1967_IMPLEMENTATION_SLOT,
  OZ_INITIALIZED_SLOT_POSITION,
  readStorage,
} from '../../../utils/storage';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

const MOCK_ADDRESS = `0x${'0123456789'.repeat(4)}`;
const DEFAULT_INITIALIZATION: [
  string,
  string,
  string,
  {receivers: string[]; amounts: number[]}
] = [
  MOCK_ADDRESS,
  'GOV',
  'GOV',
  {
    receivers: [],
    amounts: [],
  },
];

describe('ProxyFactory', function () {
  let deployer: SignerWithAddress;
  let proxyFactory: ProxyFactory;
  let logic: TestGovernanceERC20;

  before(async () => {
    deployer = (await ethers.getSigners())[0];

    logic = await new TestGovernanceERC20__factory(deployer).deploy(
      ...DEFAULT_INITIALIZATION
    );
    proxyFactory = await new ProxyFactory__factory(deployer).deploy(
      logic.address
    );
  });

  describe('initialization', async () => {
    it('points to the right logic contract', async () => {
      expect(await proxyFactory.LOGIC()).to.equal(logic.address);
    });
  });

  describe('deployUUPSProxy', async () => {
    it('deploys the proxy unitialized if no data is provided', async () => {
      const initData: any = [];

      const tx = await proxyFactory.deployUUPSProxy(initData);
      const event = await findEvent<ProxyCreatedEvent>(tx, 'ProxyCreated');
      if (!event) {
        throw new Error('Failed to get the event');
      }

      const tokenProxy = TestGovernanceERC20__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy points to the right logic contract.
      expect(
        await readStorage(tokenProxy.address, ERC1967_IMPLEMENTATION_SLOT, [
          'address',
        ])
      ).to.equal(logic.address);

      // Check that the proxy is not initialized.
      expect(
        await readStorage(tokenProxy.address, OZ_INITIALIZED_SLOT_POSITION, [
          'uint8',
        ])
      ).to.equal(0);

      // Check that the DAO address is not set.
      expect(await tokenProxy.dao()).to.equal(ethers.constants.AddressZero);
    });

    it('deploys the proxy initialized if data is provided', async () => {
      const initData =
        TestGovernanceERC20__factory.createInterface().encodeFunctionData(
          'initialize',
          DEFAULT_INITIALIZATION
        );

      const tx = await proxyFactory.deployUUPSProxy(initData);
      const event = await findEvent<ProxyCreatedEvent>(tx, 'ProxyCreated');
      if (!event) {
        throw new Error('Failed to get the event');
      }

      const tokenProxy = TestGovernanceERC20__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy points to the right logic contract.
      expect(
        await readStorage(tokenProxy.address, ERC1967_IMPLEMENTATION_SLOT, [
          'address',
        ])
      ).to.equal(logic.address);

      // Check that the proxy is initialized.
      expect(
        await readStorage(tokenProxy.address, OZ_INITIALIZED_SLOT_POSITION, [
          'uint8',
        ])
      ).to.equal(1);

      // Check that the DAO address is set.
      expect(await tokenProxy.dao()).to.equal(MOCK_ADDRESS);
    });
  });

  describe('deployMinimalProxy', async () => {
    it('deploys the proxy unitialized if no data is provided', async () => {
      const initData: any = [];

      const tx = await proxyFactory.deployMinimalProxy(initData);

      const event = await findEvent<ProxyCreatedEvent>(tx, 'ProxyCreated');
      if (!event) {
        throw new Error('Failed to get the event');
      }

      const tokenProxy = TestGovernanceERC20__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy is not initialized.
      expect(
        await readStorage(tokenProxy.address, OZ_INITIALIZED_SLOT_POSITION, [
          'uint8',
        ])
      ).to.equal(0);

      // Check that the DAO address is not set.
      expect(await tokenProxy.dao()).to.equal(ethers.constants.AddressZero);
    });

    it('deploys the proxy initialized if data is provided', async () => {
      const initData =
        TestGovernanceERC20__factory.createInterface().encodeFunctionData(
          'initialize',
          DEFAULT_INITIALIZATION
        );

      const tx = await proxyFactory.deployMinimalProxy(initData);
      const event = await findEvent<ProxyCreatedEvent>(tx, 'ProxyCreated');
      if (!event) {
        throw new Error('Failed to get the event');
      }

      const tokenProxy = TestGovernanceERC20__factory.connect(
        event.args.proxy,
        deployer
      );

      // Check that the proxy is initialized.
      expect(
        await readStorage(tokenProxy.address, OZ_INITIALIZED_SLOT_POSITION, [
          'uint8',
        ])
      ).to.equal(1);

      // Check that the DAO address is set.
      expect(await tokenProxy.dao()).to.equal(MOCK_ADDRESS);
    });
  });
});
