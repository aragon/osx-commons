import {Interface, defaultAbiCoder, EventFragment} from '@ethersproject/abi';
import {Log} from '@ethersproject/abstract-provider';
import {BigNumber} from '@ethersproject/bignumber';
import {ContractReceipt, Event} from '@ethersproject/contracts';
import {id} from '@ethersproject/hash';

export function getEmpty256Array() {
  return new Array(256).fill(false);
}

export function getDummyLog(event: EventFragment, eventArgs: any[]): Log {
  const inputs = event.inputs.map(i => i.type);

  return {
    address: '',
    blockNumber: 0,
    transactionIndex: 0,
    transactionHash: '',
    blockHash: '',
    removed: false,
    logIndex: 0,
    data: defaultAbiCoder.encode(inputs, eventArgs),
    topics: [id(event.format())],
  };
}

export function getDummyEvent(event: EventFragment, log: Log): Event {
  const e = {} as Event;
  return {
    ...log,
    ...e,
    event: event.name,
    args: defaultAbiCoder.decode(event.inputs, log.data),
  };
}

export function getInterface(event: string): Interface {
  return new Interface(event);
}
export function getDummyContractReceipt(
  event: EventFragment,
  eventArgs: any[]
): ContractReceipt {
  const logs = [getDummyLog(event, eventArgs)];
  const events = [getDummyEvent(event, logs[0])];
  return {
    to: '',
    from: '',
    contractAddress: '',
    transactionHash: '',
    transactionIndex: 0,
    blockHash: '',
    blockNumber: 0,
    cumulativeGasUsed: BigNumber.from(0),
    gasUsed: BigNumber.from(0),
    effectiveGasPrice: BigNumber.from(0),
    logsBloom: '',
    confirmations: 0,
    byzantium: true,
    type: 0,
    status: 1,
    logs,
    events,
  };
}
