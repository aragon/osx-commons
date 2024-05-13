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
  [index in Exclude<
    ContractNames,
    ContractNames.ENS_REGISTRY
  >]: ContractDeployment;
} & {
  [ContractNames.ENS_REGISTRY]?: ContractDeployment;
};

export type ContractDeployment = {
  address: string;
  blockNumber: number;
  deploymentTx: string;
};

export enum ContractNames {
  DAO_BASE = 'DAOBase',
  DAO_FACTORY = 'DAOFactory',
  DAO_REGISTRY_PROXY = 'DAORegistryProxy',
  DAO_REGISTRY_IMPLEMENTATION = 'DAORegistryImplementation',
  DAO_ENS_SUBDOMAIN_REGISTRAR_PROXY = 'DAOENSSubdomainRegistrarProxy',
  DAO_ENS_SUBDOMAIN_REGISTRAR_IMPLEMENTATION = 'DAOENSSubdomainRegistrarImplementation',
  GOVERNANCE_ERC20 = 'GovernanceERC20',
  GOVERNANCE_WRAPPED_ERC20 = 'GovernanceWrappedERC20',
  PLUGIN_REPO_BASE = 'PluginRepoBase',
  PLUGIN_REPO_FACTORY = 'PluginRepoFactory',
  PLUGIN_REPO_REGISTRY_PROXY = 'PluginRepoRegistryProxy',
  PLUGIN_REPO_REGISTRY_IMPLEMENTATION = 'PluginRepoRegistryImplementation',
  PLUGIN_SETUP_PROCESSOR = 'PluginSetupProcessor',
  PLUGIN_ENS_SUBDOMAIN_REGISTRAR_PROXY = 'PluginENSSubdomainRegistrarProxy',
  PLUGIN_ENS_SUBDOMAIN_REGISTRAR_IMPLEMENTATION = 'PluginENSSubdomainRegistrarImplementation',
  MANAGEMENT_DAO_PROXY = 'ManagementDAOProxy',
  MANAGEMENT_DAO_IMPLEMENTATION = 'ManagementDAOImplementation',
  ENS_REGISTRY = 'ENSRegistry',
}

export type ENSNetworkDomain = {
  daoEns: string;
  pluginEns: string;
};

export type ENSNetworkDomainsMap = {
  [network in SupportedNetworks]?: ENSNetworkDomain;
};
