import {SupportedNetworks} from '../networks/types';

// the entries in this enum has to be in order from
// oldest to newest so that getLatestNetworkVersion() works as expected
export enum SupportedVersions {
  V1_0_0 = 'v1.0.0',
  V1_3_0 = 'v1.3.0',
}

// this type defines the structure of the network deployments
// for each supported version. the index is the version
export type NetworkDeployments = {
  [index in SupportedVersions]?: NetworkDeployment;
};

// this type defines the structure of the network deployment
// the index is the contract name
export type NetworkDeployment = {
  [index in FrameworkContractsNames]: ContractDeployment;
} & {
  [index in NonFrameworkContractsNames]?: ContractDeployment;
};

export type ContractDeployment = {
  address: string;
  blockNumber: number;
  deploymentTx: string;
};

// contracts that must always be deployed
export enum FrameworkContractsNames {
  DAO_BASE = 'DAOBase',
  DAO_FACTORY = 'DAOFactory',
  DAO_REGISTRY_PROXY = 'DAORegistryProxy',
  DAO_REGISTRY_IMPLEMENTATION = 'DAORegistryImplementation',
  DAO_ENS_SUBDOMAIN_REGISTRAR_PROXY = 'DAOENSSubdomainRegistrarProxy',
  DAO_ENS_SUBDOMAIN_REGISTRAR_IMPLEMENTATION = 'DAOENSSubdomainRegistrarImplementation',
  PLUGIN_SETUP_PROCESSOR = 'PluginSetupProcessor',
  PLUGIN_REPO_BASE = 'PluginRepoBase',
  PLUGIN_REPO_FACTORY = 'PluginRepoFactory',
  PLUGIN_REPO_REGISTRY_PROXY = 'PluginRepoRegistryProxy',
  PLUGIN_REPO_REGISTRY_IMPLEMENTATION = 'PluginRepoRegistryImplementation',
  PLUGIN_ENS_SUBDOMAIN_REGISTRAR_PROXY = 'PluginENSSubdomainRegistrarProxy',
  PLUGIN_ENS_SUBDOMAIN_REGISTRAR_IMPLEMENTATION = 'PluginENSSubdomainRegistrarImplementation',
  MANAGEMENT_DAO_PROXY = 'ManagementDAOProxy',
  MANAGEMENT_DAO_IMPLEMENTATION = 'ManagementDAOImplementation',
}

// contracts that are optionally deployed
export enum NonFrameworkContractsNames {
  ADDRESSLIST_VOTING_SETUP = 'AddresslistVotingSetup',
  ADDRESSLIST_VOTING_SETUP_IMPLEMENTATION = 'AddresslistVotingSetupImplementation',
  ADDRESSLIST_VOTING_REPO_PROXY = 'AddresslistVotingRepoProxy',
  ADDRESSLIST_VOTING_REPO_IMPLEMENTATION = 'AddresslistVotingRepoImplementation',
  ADMIN_SETUP = 'AdminSetup',
  ADMIN_SETUP_IMPLEMENTATION = 'AdminSetupImplementation',
  ADMIN_REPO_PROXY = 'AdminRepoProxy',
  ADMIN_REPO_IMPLEMENTATION = 'AdminRepoImplementation',
  MULTISIG_SETUP = 'MultisigSetup',
  MULTISIG_SETUP_IMPLEMENTATION = 'MultisigSetupImplementation',
  MULTISIG_REPO_PROXY = 'MultisigRepoProxy',
  MULTISIG_REPO_IMPLEMENTATION = 'MultisigRepoImplementation',
  TOKEN_VOTING_SETUP = 'TokenVotingSetup',
  TOKEN_VOTING_SETUP_IMPLEMENTATION = 'TokenVotingSetupImplementation',
  TOKEN_VOTING_REPO_PROXY = 'TokenVotingRepoProxy',
  TOKEN_VOTING_REPO_IMPLEMENTATION = 'TokenVotingRepoImplementation',
  GOVERNANCE_ERC20 = 'GovernanceERC20',
  GOVERNANCE_WRAPPED_ERC20 = 'GovernanceWrappedERC20',
  ENS_REGISTRY = 'ENSRegistry',
  STAGED_PROPOSAL_PROCESSOR_REPO_PROXY = 'StagedProposalProcessorRepoProxy',
  STAGED_PROPOSAL_PROCESSOR_REPO_IMPLEMENTATION = 'StagedProposalProcessorRepoImplementation',
  STAGED_PROPOSAL_PROCESSOR_SETUP = 'StagedProposalProcessorSetup',
  STAGED_PROPOSAL_PROCESSOR_SETUP_IMPLEMENTATION = 'StagedProposalProcessorSetupImplementation',
  EXECUTOR = 'Executor',
}

export type ENSNetworkDomain = {
  daoEns: string;
  pluginEns: string;
};

export type ENSNetworkDomainsMap = {
  [network in SupportedNetworks]?: ENSNetworkDomain;
};
