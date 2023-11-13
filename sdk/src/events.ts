import {Interface, LogDescription} from '@ethersproject/abi';
import {ContractReceipt} from '@ethersproject/contracts';

/**
 * Finds a log in a receipt given the event name
 *
 * @export
 * @template T An optional type resulting in the event being typecast before being returned.
 * @param {ContractReceipt} receipt
 * @param {Interface} iface
 * @param {string} eventName
 * @return {Promise<LogDescription & (T | LogDescription)>}
 */
export function findEventTopicLog<T>(
  receipt: ContractReceipt,
  iface: Interface,
  eventName: string
): LogDescription & (T | LogDescription) {
  const topic = iface.getEventTopic(eventName);
  const log = receipt.logs.find(x => x.topics[0] === topic);
  if (!log) {
    throw new Error(
      `No logs found for the topic of event "${eventName}" in the transaction receipt.`
    );
  }
  return iface.parseLog(log) as LogDescription & (T | LogDescription);
}

/**
 * Finds a log in a receipt given the event name
 *
 * @export
 * @template T
 * @param {ContractReceipt} receipt
 * @param {string} eventName
 * @return {Promise<T>}
 */
export async function findEvent<T>(
  receipt: ContractReceipt,
  eventName: string
): Promise<T> {
  const event = (receipt.events || []).find(event => event.event === eventName);

  if (!event) {
    throw new Error(`Event ${eventName} not found in the transaction receipt.`);
  }

  return event as unknown as T;
}
