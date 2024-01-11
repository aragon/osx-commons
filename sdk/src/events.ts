import {EventNotFoundError} from './errors';
import {ContractTransaction} from 'ethers';
import {Interface, LogDescription} from 'ethers/lib/utils';

/**
 * Finds a typed event in transaction given the event name
 *
 * @export
 * @param {ContractReceipt} tx
 * @param {string} eventName
 * @return {*}  {(T)}
 */
export async function findEvent<T>(tx: ContractTransaction, eventName: string) {
  const receipt = await tx.wait();

  const event = (receipt.events || []).find(event => event.event === eventName);

  if (!event) {
    throw new EventNotFoundError(eventName, tx);
  }

  return event as T;
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
    throw new EventNotFoundError(eventName, tx);
  }
  return iface.parseLog(log) as LogDescription & (T | LogDescription);
}
export const IPROPOSAL_EVENTS = {
  PROPOSAL_CREATED: 'ProposalCreated',
  PROPOSAL_EXECUTED: 'ProposalExecuted',
};

export const IDAO_EVENTS = {
  METADATA_SET: 'MetadataSet',
  EXECUTED: 'Executed',
  DEPOSITED: 'Deposited',
  STANDARD_CALLBACK_REGISTERED: 'StandardCallbackRegistered',
  TRUSTED_FORWARDER_SET: 'TrustedForwarderSet',
  NEW_URI: 'NewURI',
};

export const IMEMBERSHIP_EVENTS = {
  MEMBERS_ADDED: 'MembersAdded',
  MEMBERS_REMOVED: 'MembersRemoved',
  MEMBERSHIP_CONTRACT_ANNOUNCED: 'MembershipContractAnnounced',
};
