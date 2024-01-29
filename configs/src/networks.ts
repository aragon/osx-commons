import {
  NetworkConfig,
  NetworkConfigs,
  SupportedAliases,
  SupportedNetworks,
} from './types';

/**
 * Retrieves the network configuration for a given supported network.
 *
 * @param {SupportedNetworks} network - The supported network to retrieve the configuration for.
 * @return {NetworkConfig | null} The network configuration if it exists, otherwise null.
 */
export function getNetwork(network: SupportedNetworks): NetworkConfig | null {
  if (networks[network]) {
    return networks[network];
  }

  return null;
}

export function getNetworkByChainId(chainId: number): NetworkConfig | null {
  return (
    Object.values(networks).find(network => network.chainId === chainId) || null
  );
}

/**
 * Retrieves the network configuration object by name or alias.
 *
 * @param {string | SupportedNetworks | number} network - The name or alias of the network.
 * @return {NetworkConfig | null} The network configuration object if found, or `null` if not found.
 */
export function getNetworkByNameAliasOrChainId(
  network: string | SupportedNetworks | number
): NetworkConfig | null {
  let networkConfig: NetworkConfig | null = null;
  if (typeof network === 'number') {
    networkConfig = getNetworkByChainId(network);
  } else {
    networkConfig =
      getNetworkByAlias(network) || getNetwork(network as SupportedNetworks);
  }
  if (networkConfig) {
    return networkConfig;
  }
  return null;
}

/**
 * Retrieves the network configuration object based on the given alias.
 *
 * @param {string} alias - The alias of the network.
 * @return {NetworkConfig | null} The network configuration object corresponding to the alias, or null if not found.
 */
export function getNetworkByAlias(alias: string): NetworkConfig | null {
  const networkName = getNetworkNameByAlias(alias);
  if (networkName) {
    return getNetwork(networkName);
  }
  return null;
}

/**
 * Retrieves the network name by its alias. If the name is already supported it returns the alias back as name
 *
 * @param {string} alias - The alias of the network.
 * @return {SupportedNetworks | null} The network name corresponding to the alias, or null if no match is found.
 */
export function getNetworkNameByAlias(alias: string): SupportedNetworks | null {
  if (Object.values(SupportedNetworks).includes(alias as SupportedNetworks)) {
    return alias as SupportedNetworks;
  }

  for (const networkName of Object.values(SupportedNetworks)) {
    const network = getNetwork(networkName);
    if (network) {
      const aliases = Object.values(network.aliases);
      if (aliases.includes(alias)) {
        return networkName;
      }
    }
  }
  return null;
}

export function getNetworkAlias(
  aliasName: SupportedAliases,
  network: SupportedNetworks
): string | null {
  const networkConfig = getNetwork(network);
  if (!networkConfig) {
    return null;
  }
  return networkConfig.aliases[aliasName] || network;
}

export const networks: NetworkConfigs = {
  [SupportedNetworks.MAINNET]: {
    url: 'https://rpc.tenderly.co/fork/d3168a50-0941-42e2-8b9b-bf544c60c356',
    isTestnet: false,
    chainId: 1,
    name: SupportedNetworks.MAINNET,
    aliases: {
      ethers5: 'homestead',
    },
  },
  [SupportedNetworks.GOERLI]: {
    url: 'https://goerli.infura.io/v3/481a4cdc7c774286b8627f21c6827f48',
    isTestnet: true,
    chainId: 5,
    name: SupportedNetworks.GOERLI,
    aliases: {},
  },
  [SupportedNetworks.SEPOLIA]: {
    url: 'https://sepolia.infura.io/v3/481a4cdc7c774286b8627f21c6827f48',
    isTestnet: true,
    chainId: 11155111,
    name: SupportedNetworks.SEPOLIA,
    aliases: {},
  },
  [SupportedNetworks.POLYGON]: {
    url: 'https://polygon-mainnet.infura.io/v3/481a4cdc7c774286b8627f21c6827f48',
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
    url: 'https://polygon-mumbai.infura.io/v3/481a4cdc7c774286b8627f21c6827f48',
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
    url: 'https://developer-access-mainnet.base.org',
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
    url: 'https://sepolia.base.org',
    isTestnet: true,
    chainId: 84532,
    gasPrice: 1000000,
    name: SupportedNetworks.BASE_SEPOLIA,
    aliases: {
      alchemySubgraphs: 'base-sepolia',
    },
  },
  [SupportedNetworks.ARBITRUM]: {
    url: 'https://arbitrum-mainnet.infura.io/v3/481a4cdc7c774286b8627f21c6827f48',
    isTestnet: false,
    chainId: 42161,
    name: SupportedNetworks.ARBITRUM,
    aliases: {
      alchemySubgraphs: 'arbitrum-one',
    },
  },
  [SupportedNetworks.ARBITRUM_SEPOLIA]: {
    url: 'https://arbitrum-sepolia.infura.io/v3/481a4cdc7c774286b8627f21c6827f48',
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
