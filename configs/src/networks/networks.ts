import {NetworkConfigs, SupportedNetworks, NetworkRpcUrl} from './types';

export const networks: NetworkConfigs = {
  [SupportedNetworks.MAINNET]: {
    isTestnet: false,
    chainId: 1,
    name: SupportedNetworks.MAINNET,
    aliases: {
      ethers5: 'homestead',
    },
  },
  [SupportedNetworks.GOERLI]: {
    isTestnet: true,
    chainId: 5,
    name: SupportedNetworks.GOERLI,
    aliases: {},
  },
  [SupportedNetworks.SEPOLIA]: {
    isTestnet: true,
    chainId: 11155111,
    name: SupportedNetworks.SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.DEV_SEPOLIA]: {
    isTestnet: true,
    chainId: 11155111,
    name: SupportedNetworks.DEV_SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.HOLESKY]: {
    isTestnet: true,
    chainId: 17000,
    name: SupportedNetworks.HOLESKY,
    aliases: {},
  },
  [SupportedNetworks.POLYGON]: {
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
    isTestnet: false,
    chainId: 8453,
    gasPrice: 1000,
    name: SupportedNetworks.BASE,
    aliases: {
      alchemySubgraphs: 'base',
    },
  },
  [SupportedNetworks.BASE_GOERLI]: {
    isTestnet: true,
    chainId: 84531,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_GOERLI,
    aliases: {
      alchemySubgraphs: 'base-testnet',
    },
  },
  [SupportedNetworks.BASE_SEPOLIA]: {
    isTestnet: true,
    chainId: 84532,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_SEPOLIA,
    aliases: {
      alchemySubgraphs: 'base-sepolia',
    },
  },
  [SupportedNetworks.ARBITRUM]: {
    isTestnet: false,
    chainId: 42161,
    name: SupportedNetworks.ARBITRUM,
    aliases: {
      alchemySubgraphs: 'arbitrum-one',
    },
  },
  [SupportedNetworks.ARBITRUM_SEPOLIA]: {
    isTestnet: true,
    chainId: 421614,
    name: SupportedNetworks.ARBITRUM_SEPOLIA,
    aliases: {
      alchemySubgraphs: 'arbitrum-sepolia',
    },
  },
  [SupportedNetworks.ZKSYNC_SEPOLIA]: {
    chainId: 300,
    isTestnet: true,
    name: SupportedNetworks.ZKSYNC_SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.ZKSYNC_MAINNET]: {
    chainId: 324,
    isTestnet: true,
    name: SupportedNetworks.ZKSYNC_MAINNET,
    aliases: {},
  },
  [SupportedNetworks.LOCAL]: {
    isTestnet: true,
    chainId: 31337,
    name: SupportedNetworks.LOCAL,
    aliases: {},
  },
};

export const networksAlchemyRpcUrl: NetworkRpcUrl = {
  [SupportedNetworks.MAINNET]: 'https://eth-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.GOERLI]: 'https://eth-goerli.g.alchemy.com/v2/',
  [SupportedNetworks.SEPOLIA]: 'https://eth-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.DEV_SEPOLIA]: 'https://eth-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.HOLESKY]: 'https://eth-holesky.g.alchemy.com/v2/',
  [SupportedNetworks.POLYGON]: 'https://polygon-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.MUMBAI]: 'https://polygon-mumbai.g.alchemy.com/v2/',
  [SupportedNetworks.BASE]: 'https://base-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.BASE_GOERLI]: 'https://goerli.base.org',
  [SupportedNetworks.BASE_SEPOLIA]: 'https://base-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.ARBITRUM]: 'https://arb-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.ARBITRUM_SEPOLIA]: 'https://arb-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.ZKSYNC_SEPOLIA]:
    'https://zksync-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.ZKSYNC_MAINNET]:
    'https://zksync-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.LOCAL]: 'http://localhost:8545',
};

export function addRpcUrlToNetwork(
  apiKey: string,
  networksRpcUrl: NetworkRpcUrl = networksAlchemyRpcUrl
) {
  // add the api key to the network urls
  for (const network of Object.values(SupportedNetworks)) {
    if (
      network == SupportedNetworks.LOCAL ||
      network == SupportedNetworks.BASE_GOERLI
    ) {
      networks[network].url = networksRpcUrl[network];
    } else {
      networks[network].url = `${networksRpcUrl[network]}${apiKey}`;
    }
  }
}
