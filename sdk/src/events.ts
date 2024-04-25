import {EventNotFoundError} from './errors';
import {Interface, LogDescription} from '@ethersproject/abi';
import {ContractReceipt, Event} from '@ethersproject/contracts';

/**
 * Finds a typed event in transaction given the event name
 *
 * @export
 * @param {ContractReceipt} receipt
 * @param {string} eventName
 * @return {T}
 */
export function findEvent<T extends Event>(
  receipt: ContractReceipt,
  eventName: string
): T {
  const event = (receipt.events || []).find(event => event.event === eventName);

  if (!event) {
    throw new EventNotFoundError(eventName, receipt);
  }

  return event as T;
}

/**
 * Finds a log in a transaction given the interface of the emitting contract and the event name
 *
 * @export
 * @param {ContractReceipt} receipt
 * @param {Interface} iface
 * @param {string} eventName
 * @return {LogDescription & T}
 */
export function findEventTopicLog<T extends Event>(
  receipt: ContractReceipt,
  iface: Interface,
  eventName: string
): LogDescription & T {
  const topic = iface.getEventTopic(eventName);
  const log = receipt.logs.find(x => x.topics[0] === topic);
  if (!log) {
    throw new EventNotFoundError(eventName, receipt);
  }
  return iface.parseLog(log) as LogDescription & T;
}
