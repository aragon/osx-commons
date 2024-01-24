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

export const CALLBACK_HANDLER_EVENTS = {
  CallbackReceived: 'CallbackReceived',
};

export const DAO_EVENTS = {
  NewURI: 'NewURI',
};

export const DAO_REGISTRY_EVENTS = {
  DAORegistered: 'DAORegistered',
};

export const IPROPOSAL_EVENTS = {
  ProposalCreated: 'ProposalCreated',
  ProposalExecuted: 'ProposalExecuted',
};

export const IDAO_EVENTS = {
  MetadataSet: 'MetadataSet',
  Executed: 'Executed',
  Deposited: 'Deposited',
  StandardCallbackRegistered: 'StandardCallbackRegistered',
  TrustedForwarderSet: 'TrustedForwarderSet',
  NewURI: 'NewURI',
};

export const IMEMBERSHIP_EVENTS = {
  MembersAdded: 'MembersAdded',
  MembersRemoved: 'MembersRemoved',
  MembershipContractAnnounced: 'MembershipContractAnnounced',
};

export const INTERFACE_BASED_REGISTRY_EVENTS = {
  Registered: 'Registered',
};

export const PERMISSION_MANAGER = {
  Granted: 'Granted',
  Revoked: 'Revoked',
};

export const PLUGIN_REPO_EVENTS = {
  VersionCreated: 'VersionCreated',
};

export const PLUGIN_REPO_REGISTRY_EVENTS = {
  PluginRepoRegistered: 'PluginRepoRegistered',
  ReleaseMetadataUpdated: 'ReleaseMetadataUpdated',
};

export const PLUGIN_SETUP_PROCESSOR_EVENTS = {
  InstallationPrepared: 'InstallationPrepared',
  InstallationApplied: 'InstallationApplied',
  UpdatePrepared: 'UpdatePrepared',
  UpdateApplied: 'UpdateApplied',
  UninstallationPrepared: 'UninstallationPrepared',
  UninstallationApplied: 'UninstallationApplied',
};

export const UUPS_UPGRADEABLE_EVENTS = {
  Upgraded: 'Upgraded',
};
