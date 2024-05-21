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
  LOCAL = 'local',
  ZKSYNC_SEPOLIA = 'zksyncSepolia',
}

export type NetworkConfig = {
  url?: string;
  isTestnet: boolean;
  chainId: number;
  name: SupportedNetworks;
  feesUrl?: string;
  gasPrice?: number;
  aliases: NetworkAliases;
};

export type NetworkAliases = {
  [index in SupportedAliases]?: string;
};

export type NetworkConfigs = {
  [network in SupportedNetworks]: NetworkConfig;
};

export type NetworkRpcUrl = {
  [index in SupportedNetworks]: string;
};
