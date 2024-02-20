import {EventNotFoundError} from './errors';
import {ContractReceipt} from '@ethersproject/contracts';
import {Interface, LogDescription} from 'ethers/lib/utils';

/**
 * Finds a typed event in transaction given the event name
 *
 * @export
 * @param {ContractReceipt} cr
 * @param {string} eventName
 * @return {*}  {(T)}
 */
export function findEvent<T>(cr: ContractReceipt, eventName: string): T {
  const event = (cr.events || []).find(event => event.event === eventName);

  if (!event) {
    throw new EventNotFoundError(eventName, cr);
  }

  return event as T;
}

/**
 * Finds a log in a transaction given the interface of the emitting contract and the event name
 *
 * @export
 * @param {ContractReceipt} cr
 * @param {Interface} iface
 * @param {string} eventName
 * @return {*}  {LogDescription & (T | LogDescription)}
 */
export function findEventTopicLog<T>(
  cr: ContractReceipt,
  iface: Interface,
  eventName: string
): LogDescription & (T | LogDescription) {
  const topic = iface.getEventTopic(eventName);
  const log = cr.logs.find(x => x.topics[0] === topic);
  if (!log) {
    throw new EventNotFoundError(eventName, cr);
  }
  return iface.parseLog(log) as LogDescription & (T | LogDescription);
}
