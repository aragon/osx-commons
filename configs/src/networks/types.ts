export enum SupportedAliases {
  ETHERS_5 = 'ethers5',
  ETHERS_6 = 'ethers6',
}

export enum SupportedNetworks {
  MAINNET = 'mainnet',
  GOERLI = 'goerli',
  SEPOLIA = 'sepolia',
  DEV_SEPOLIA = 'devSepolia',
  HOLESKY = 'holesky',
  POLYGON = 'polygon',
  MUMBAI = 'mumbai',
  BASE = 'baseMainnet',
  BASE_GOERLI = 'baseGoerli',
  BASE_SEPOLIA = 'baseSepolia',
  ARBITRUM = 'arbitrum',
  ARBITRUM_SEPOLIA = 'arbitrumSepolia',
  ZKSYNC_SEPOLIA = 'zksyncSepolia',
  ZKSYNC_MAINNET = 'zksyncMainnet',
  LINEA_SEPOLIA = 'lineaSepolia',
  MODE_MAINNET = 'modeMainnet',
  BSC_MAINNET = 'bscMainnet',
  BSC_TESTNET = 'bscTestnet',
  LINEA = 'linea',
  PEAQ = 'peaq',
  AGUNG_TESTNET = 'agungTestnet',
  LOCAL = 'local',
  MONAD_TESTNET = 'monadTestnet',
  UNICHAIN = 'unichain',
  CORN = 'corn',
  CELO = 'celo',
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
