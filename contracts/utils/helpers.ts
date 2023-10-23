import {ProxyFactory__factory} from '../typechain';
import {ProxyCreatedEvent} from '../typechain/src/utils/ProxyFactory';
import {ContractFactory, ContractTransaction} from 'ethers';
import {
  Interface,
  LogDescription,
  defaultAbiCoder,
  keccak256,
} from 'ethers/lib/utils';
import {ethers} from 'hardhat';

export function toBytes(string: string) {
  return ethers.utils.formatBytes32String(string);
}

export function hashHelpers(helpers: string[]) {
  return keccak256(defaultAbiCoder.encode(['address[]'], [helpers]));
}

export async function findEvent<T>(tx: ContractTransaction, eventName: string) {
  const receipt = await tx.wait();

  const event = (receipt.events || []).find(event => event.event === eventName);

  return event as T | undefined;
}

export async function findEventTopicLog<T>(
  tx: ContractTransaction,
  iface: Interface,
  eventName: string
): Promise<LogDescription & (T | LogDescription)> {
  const receipt = await tx.wait();
  const topic = iface.getEventTopic(eventName);
  const log = receipt.logs.find(x => x.topics[0] === topic);
  if (!log) {
    throw new Error(`No logs found for the topic of event "${eventName}".`);
  }
  return iface.parseLog(log) as LogDescription & (T | LogDescription);
}

export async function deployUUPSProxy<T>(
  contractFactory: ContractFactory,
  initialization: {initializerName: string; args: any[]} | undefined = undefined
): Promise<T> {
  const logic = await contractFactory.deploy();
  const proxyFactory = await new ProxyFactory__factory(
    contractFactory.signer
  ).deploy(logic.address);

  const initData =
    initialization !== undefined
      ? contractFactory.interface.encodeFunctionData(
          initialization.initializerName,
          initialization.args
        )
      : [];

  const tx = await proxyFactory.deployUUPSProxy(initData);

  const event = await findEvent<ProxyCreatedEvent>(tx, 'ProxyCreated');
  if (!event) {
    throw new Error('Failed to get the event');
  }

  return contractFactory.attach(event.args.proxy) as unknown as T;
}

export async function deployMinimalClone<T>(
  contractFactory: ContractFactory,
  initialization: {initializerName: string; args: any[]} | undefined = undefined
): Promise<T> {
  const logic = await contractFactory.deploy();
  const proxyFactory = await new ProxyFactory__factory(
    contractFactory.signer
  ).deploy(logic.address);

  const initData =
    initialization !== undefined
      ? contractFactory.interface.encodeFunctionData(
          initialization.initializerName,
          initialization.args
        )
      : [];

  const tx = await proxyFactory.deployMinimalProxy(initData);

  const event = await findEvent<ProxyCreatedEvent>(tx, 'ProxyCreated');
  if (!event) {
    throw new Error('Failed to get the event');
  }

  return contractFactory.attach(event.args.clone) as unknown as T;
}
