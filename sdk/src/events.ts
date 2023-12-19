import {ContractTransaction} from 'ethers';
import {Interface, LogDescription} from 'ethers/lib/utils';

/**
 * Finds a typed event in transaction given the event name
 *
 * @export
 * @param {ContractReceipt} tx
 * @param {string} eventName
 * @return {*}  {(Log | undefined)}
 */
export async function findEvent<T>(tx: ContractTransaction, eventName: string) {
  const receipt = await tx.wait();

  const event = (receipt.events || []).find(event => event.event === eventName);

  return event as T | undefined;
}
/**
 * Finds a log in a transaction given the interface of the emitting contract and the event name
 *
 * @export
 * @param {ContractTransaction} tx
 * @param {Interface} iface
 * @param {string} eventName
 * @return {*}  {(LogDescription | undefined)}
 */
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
