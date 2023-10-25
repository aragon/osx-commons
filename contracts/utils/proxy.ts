import {ProxyFactory__factory} from '../typechain';
import {ProxyCreatedEvent} from '../typechain/src/utils/ProxyFactory';
import {findEvent} from './events';
import {ContractFactory} from 'ethers';

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

  return contractFactory.attach(event.args.proxy) as unknown as T;
}
