export type NetworkConfig = {
  url: string;
  isTestnet: boolean;
  chainId: number;
  feesUrl?: string;
  gasPrice?: number;
  aliases: NetworkAliases;
};

export type NetworkAliases = {
  [index in SupportedAliases]?: string;
};

export type NetworkConfigs<T = NetworkConfig> = {
  [network in SupportedNetworks]: T;
};

export enum SupportedAliases {
  ETHERS_5 = 'ethers5',
  ETHERS_6 = 'ethers6',
  ALCHEMY_SUBGRAPHS = 'alchemySubgraphs',
}

export enum SupportedNetworks {
  MAINNET = 'mainnet',
  GOERLI = 'goerli',
  SEPOLIA = 'sepolia',
  POLYGON = 'polygon',
  MUMBAI = 'mumbai',
  BASE = 'baseMainnet',
  BASE_GOERLI = 'baseGoerli',
  BASE_SEPOLIA = 'baseSepolia',
  ARBITRUM = 'arbitrum',
  ARBITRUM_SEPOLIA = 'arbitrumSepolia',
}

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
  [index in ContractNames]: ContractDeployment & {
    ENSRegistry?: ContractDeployment;
  };
};

export type ContractDeployment = {
  address: string;
  blockNumber: number;
  deploymentTx: string;
};

export enum ContractNames {
  ADDRESSLIST_VOTING_SETUP = 'AddresslistVotingSetup',
  ADDRESSLIST_VOTING_SETUP_IMPLEMENTATION = 'AddresslistVotingSetupImplementation',
  ADMIN_SETUP = 'AdminSetup',
  ADMIN_SETUP_IMPLEMENTATION = 'AdminSetupImplementation',
  DAO_BASE = 'DAOBase',
  DAO_FACTORY = 'DAOFactory',
  DAO_REGISTRY_PROXY = 'DAORegistryProxy',
  DAO_REGISTRY_IMPLEMENTATION = 'DAORegistryImplementation',
  DAO_ENS_SUBDOMAIN_REGISTRAR_PROXY = 'DAOENSSubdomainRegistrarProxy',
  DAO_ENS_SUBDOMAIN_REGISTRAR_IMPLEMENTATION = 'DAOENSSubdomainRegistrarImplementation',
  GOVERNANCE_ERC20 = 'GovernanceERC20',
  GOVERNANCE_WRAPPED_ERC20 = 'GovernanceWrappedERC20',
  MULTISIG_SETUP = 'MultisigSetup',
  MULTISIG_SETUP_IMPLEMENTATION = 'MultisigSetupImplementation',
  PLUGIN_REPO_BASE = 'PluginRepoBase',
  PLUGIN_REPO_FACTORY = 'PluginRepoFactory',
  PLUGIN_REPO_REGISTRY_PROXY = 'PluginRepoRegistryProxy',
  PLUGIN_REPO_REGISTRY_IMPLEMENTATION = 'PluginRepoRegistryImplementation',
  PLUGIN_SETUP_PROCESSOR = 'PluginSetupProcessor',
  PLUGIN_ENS_SUBDOMAIN_REGISTRAR_PROXY = 'PluginENSSubdomainRegistrarProxy',
  PLUGIN_ENS_SUBDOMAIN_REGISTRAR_IMPLEMENTATION = 'PluginENSSubdomainRegistrarImplementation',
  TOKEN_VOTING_SETUP = 'TokenVotingSetup',
  TOKEN_VOTING_SETUP_IMPLEMENTATION = 'TokenVotingSetupImplementation',
  ADDRESSLIST_VOTING_REPO_PROXY = 'AddresslistVotingRepoProxy',
  ADDRESSLIST_VOTING_REPO_IMPLEMENTATION = 'AddresslistVotingRepoImplementation',
  ADMIN_REPO_PROXY = 'AdminRepoProxy',
  ADMIN_REPO_IMPLEMENTATION = 'AdminRepoImplementation',
  MANAGEMENT_DAO_PROXY = 'ManagementDAOProxy',
  MANAGEMENT_DAO_IMPLEMENTATION = 'ManagementDAOImplementation',
  MULTISIG_REPO_PROXY = 'MultisigRepoProxy',
  MULTISIG_REPO_IMPLEMENTATION = 'MultisigRepoImplementation',
  TOKEN_VOTING_REPO_PROXY = 'TokenVotingRepoProxy',
  TOKEN_VOTING_REPO_IMPLEMENTATION = 'TokenVotingRepoImplementation',
}
