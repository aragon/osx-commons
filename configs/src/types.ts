export type NetworkConfig = {
  url: string;
  isTestnet: boolean;
  chainId: number;
  aliases: NetworkAliases;
};

export type NetworkAliases = {
  ethers5?: string;
  ethers6?: string;
  alchemySubgraphs?: string;
};

export type NetworkConfigs<T = NetworkConfig> = {
  [network: string]: T;
};
