export type NetworkConfig = {
  url: string;
  isTestnet: boolean;
  chainId: number;
  feesUrl?: string;
  gasPrice?: number;
  aliases: NetworkAliases;
};

export type NetworkAliases = {
  ethers5?: string;
  ethers6?: string;
  alchemySubgraphs?: string;
};

export type NetworkConfigs<T = NetworkConfig> = {
  [network in SupportedNetworks]: T;
};

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
  V100 = 'v1.0.0',
  V130 = 'v1.3.0',
}

// this type defines the structure of the network deployments
// for each supported version. the index is the version
export type NetworkDeployments = {
  [index in SupportedVersions]?: NetworkDeployment;
};

// this type defines the structure of the network deployment
// the index is the contract name
export type NetworkDeployment = {
  [index: string]: ContractDeployment;
};

export type ContractDeployment = {
  address: string;
  blockNumber: number;
  deploymentTx: string;
};
