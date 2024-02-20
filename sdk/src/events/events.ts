export enum CallbackHandlerEvents {
  CALLBACK_RECEIVED = 'CallbackReceived',
}

export enum ProxyFactoryEvents {
  PROXY_CREATED = 'ProxyCreated',
}

export enum DaoEvents {
  NEW_URI = 'NewURI',
}

export enum DaoRegistryEvents {
  DAO_REGISTERED = 'DAORegistered',
}

export enum IProposalEvents {
  PROPOSAL_CREATED = 'ProposalCreated',
  PROPOSAL_EXECUTED = 'ProposalExecuted',
}

export enum IDaoEvents {
  METADATA_SET = 'MetadataSet',
  EXECUTED = 'Executed',
  DEPOSITED = 'Deposited',
  STANDARD_CALLBACK_REGISTERED = 'StandardCallbackRegistered',
  TRUSTED_FORWARDER_SET = 'TrustedForwarderSet',
  NEW_URI = 'NewURI',
}

export enum IMembershipEvents {
  MEMBERS_ADDED = 'MembersAdded',
  MEMBERS_REMOVED = 'MembersRemoved',
  MEMBERSHIP_CONTRACT_ANNOUNCED = 'MembershipContractAnnounced',
}

export enum InterfaceBasedRegistryEvents {
  REGISTERED = 'Registered',
}

export enum PermissionManagerEvents {
  GRANTED = 'Granted',
  REVOKED = 'Revoked',
}

export enum PluginRepoEvents {
  VERSION_CREATED = 'VersionCreated',
}

export enum PluginRepoRegistryEvents {
  PLUGIN_REPO_REGISTERED = 'PluginRepoRegistered',
  RELEASE_METADATA_UPDATED = 'ReleaseMetadataUpdated',
}

export enum PluginSetupProcessorEvents {
  INSTALLATION_PREPARED = 'InstallationPrepared',
  INSTALLATION_APPLIED = 'InstallationApplied',
  UPDATE_PREPARED = 'UpdatePrepared',
  UPDATE_APPLIED = 'UpdateApplied',
  UNINSTALLATION_PREPARED = 'UninstallationPrepared',
  UNINSTALLATION_APPLIED = 'UninstallationApplied',
}

export enum UupsUpgradableEvents {
  UPGRADED = 'Upgraded',
}

