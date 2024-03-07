import {NetworkConfigs, SupportedNetworks} from './types';

export const networks: NetworkConfigs = {
  [SupportedNetworks.MAINNET]: {
    url: 'https://rpc.ankr.com/eth',
    isTestnet: false,
    chainId: 1,
    name: SupportedNetworks.MAINNET,
    aliases: {
      ethers5: 'homestead',
    },
  },
  [SupportedNetworks.GOERLI]: {
    url: 'https://rpc.ankr.com/eth_goerli',
    isTestnet: true,
    chainId: 5,
    name: SupportedNetworks.GOERLI,
    aliases: {},
  },
  [SupportedNetworks.SEPOLIA]: {
    url: 'https://rpc.ankr.com/eth_sepolia',
    isTestnet: true,
    chainId: 11155111,
    name: SupportedNetworks.SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.POLYGON]: {
    url: 'https://rpc.ankr.com/polygon',
    isTestnet: false,
    chainId: 137,
    feesUrl: 'https://gasstation-mainnet.matic.network/v2',
    name: SupportedNetworks.POLYGON,
    aliases: {
      ethers5: 'matic',
      ethers6: 'matic',
      alchemySubgraphs: 'matic',
    },
  },
  [SupportedNetworks.MUMBAI]: {
    url: 'https://rpc.ankr.com/polygon_mumbai',
    isTestnet: true,
    chainId: 80001,
    feesUrl: 'https://gasstation-mumbai.matic.today/v2',
    name: SupportedNetworks.MUMBAI,
    aliases: {
      ethers5: 'maticmum',
      ethers6: 'matic-mumbai',
      alchemySubgraphs: 'mumbai',
    },
  },
  [SupportedNetworks.BASE]: {
    url: 'https://rpc.ankr.com/base',
    isTestnet: false,
    chainId: 8453,
    gasPrice: 1000,
    name: SupportedNetworks.BASE,
    aliases: {
      alchemySubgraphs: 'base',
    },
  },
  [SupportedNetworks.BASE_GOERLI]: {
    url: 'https://goerli.base.org',
    isTestnet: true,
    chainId: 84531,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_GOERLI,
    aliases: {
      alchemySubgraphs: 'base-testnet',
    },
  },
  [SupportedNetworks.BASE_SEPOLIA]: {
    url: 'https://rpc.ankr.com/base_sepolia',
    isTestnet: true,
    chainId: 84532,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_SEPOLIA,
    aliases: {
      alchemySubgraphs: 'base-sepolia',
    },
  },
  [SupportedNetworks.ARBITRUM]: {
    url: 'https://rpc.ankr.com/arbitrum',
    isTestnet: false,
    chainId: 42161,
    name: SupportedNetworks.ARBITRUM,
    aliases: {
      alchemySubgraphs: 'arbitrum-one',
    },
  },
  [SupportedNetworks.ARBITRUM_SEPOLIA]: {
    url: 'https://rpc.ankr.com/arbitrum_sepolia',
    isTestnet: true,
    chainId: 421614,
    name: SupportedNetworks.ARBITRUM_SEPOLIA,
    aliases: {
      alchemySubgraphs: 'arbitrum-sepolia',
    },
  },
  [SupportedNetworks.LOCAL]: {
    url: 'http://localhost:8545',
    isTestnet: true,
    chainId: 31337,
    name: SupportedNetworks.LOCAL,
    aliases: {},
  },
};
