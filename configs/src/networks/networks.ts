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
    },
  },
  [SupportedNetworks.BASE]: {
    isTestnet: false,
    chainId: 8453,
    gasPrice: 1000,
    name: SupportedNetworks.BASE,
    aliases: {},
  },
  [SupportedNetworks.BASE_GOERLI]: {
    isTestnet: true,
    chainId: 84531,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_GOERLI,
    aliases: {},
  },
  [SupportedNetworks.BASE_SEPOLIA]: {
    isTestnet: true,
    chainId: 84532,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.ARBITRUM]: {
    isTestnet: false,
    chainId: 42161,
    name: SupportedNetworks.ARBITRUM,
    aliases: {},
  },
  [SupportedNetworks.ARBITRUM_SEPOLIA]: {
    isTestnet: true,
    chainId: 421614,
    name: SupportedNetworks.ARBITRUM_SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.AVALANCHE_TESTNET]: {
    isTestnet: true,
    chainId: 43113,
    name: SupportedNetworks.AVALANCHE_TESTNET,
    aliases: {},
  },
  [SupportedNetworks.OPTIMISM]: {
    isTestnet: false,
    chainId: 10,
    name: SupportedNetworks.OPTIMISM,
    aliases: {},
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
  [SupportedNetworks.LINEA_SEPOLIA]: {
    chainId: 59141,
    isTestnet: true,
    name: SupportedNetworks.LINEA_SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.LINEA]: {
    chainId: 59144,
    isTestnet: false,
    name: SupportedNetworks.LINEA,
    aliases: {},
  },
  [SupportedNetworks.PEAQ]: {
    chainId: 3338,
    isTestnet: false,
    name: SupportedNetworks.PEAQ,
    aliases: {},
  },
  [SupportedNetworks.AGUNG_TESTNET]: {
    chainId: 9990,
    isTestnet: false,
    name: SupportedNetworks.AGUNG_TESTNET,
    aliases: {},
  },
  [SupportedNetworks.BSC_MAINNET]: {
    chainId: 56,
    isTestnet: false,
    name: SupportedNetworks.BSC_MAINNET,
    aliases: {},
  },
  [SupportedNetworks.BSC_TESTNET]: {
    chainId: 97,
    isTestnet: true,
    name: SupportedNetworks.BSC_TESTNET,
    aliases: {},
  },
  [SupportedNetworks.LOCAL]: {
    isTestnet: true,
    chainId: 31337,
    name: SupportedNetworks.LOCAL,
    aliases: {},
  },
  [SupportedNetworks.MODE_MAINNET]: {
    isTestnet: false,
    chainId: 34443,
    name: SupportedNetworks.MODE_MAINNET,
    aliases: {},
  },
  [SupportedNetworks.MONAD_TESTNET]: {
    isTestnet: true,
    chainId: 10143,
    name: SupportedNetworks.MONAD_TESTNET,
    aliases: {},
  },
  [SupportedNetworks.UNICHAIN]: {
    isTestnet: false,
    chainId: 1301,
    name: SupportedNetworks.UNICHAIN,
    aliases: {},
  },
  [SupportedNetworks.CORN]: {
    isTestnet: false,
    chainId: 21000000,
    name: SupportedNetworks.CORN,
    aliases: {},
  },
  [SupportedNetworks.CELO]: {
    isTestnet: false,
    chainId: 42220,
    name: SupportedNetworks.CELO,
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
  [SupportedNetworks.AVALANCHE_TESTNET]:
    'https://api.avax-test.network/ext/bc/C/rpc',
  [SupportedNetworks.OPTIMISM]: 'https://opt-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.ZKSYNC_SEPOLIA]:
    'https://zksync-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.ZKSYNC_MAINNET]:
    'https://zksync-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.LINEA]: 'https://linea-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.LINEA_SEPOLIA]: 'https://linea-sepolia.g.alchemy.com/v2/',
  [SupportedNetworks.PEAQ]: 'https://mpfn1.peaq.network',
  [SupportedNetworks.AGUNG_TESTNET]: 'https://wss-async.agung.peaq.network',
  [SupportedNetworks.MODE_MAINNET]: 'https://mainnet.mode.network/',
  [SupportedNetworks.BSC_MAINNET]: 'https://bnb-mainnet.g.alchemy.com/v2/',
  [SupportedNetworks.BSC_TESTNET]: 'https://bnb-testnet.g.alchemy.com/v2/',
  [SupportedNetworks.MONAD_TESTNET]: 'https://testnet-rpc.monad.xyz',
  [SupportedNetworks.UNICHAIN]: 'https://unichain-rpc.publicnode.com',
  [SupportedNetworks.CORN]: 'https://mainnet.corn-rpc.com',
  [SupportedNetworks.CELO]: 'https://celo-mainnet.g.alchemy.com/v2/',
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
      network == SupportedNetworks.BASE_GOERLI ||
      network == SupportedNetworks.PEAQ ||
      network == SupportedNetworks.AGUNG_TESTNET ||
      network == SupportedNetworks.BSC_MAINNET ||
      network == SupportedNetworks.BSC_TESTNET ||
      network == SupportedNetworks.MODE_MAINNET ||
      network == SupportedNetworks.MONAD_TESTNET ||
      network == SupportedNetworks.UNICHAIN ||
      network == SupportedNetworks.CORN
    ) {
      networks[network].url = networksRpcUrl[network];
    } else {
      networks[network].url = `${networksRpcUrl[network]}${apiKey}`;
    }
  }
}
