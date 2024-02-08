import {networks} from './networks';
import {NetworkConfig, SupportedAliases, SupportedNetworks} from './types';

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
 * @param {string | SupportedNetworks} network - The name or alias of the network.
 * @return {NetworkConfig | null} The network configuration object if found, or `null` if not found.
 */
export function getNetworkByNameOrAlias(
  network: string | SupportedNetworks
): NetworkConfig | null {
  const networkConfig =
    getNetworkByAlias(network) || getNetwork(network as SupportedNetworks);
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
