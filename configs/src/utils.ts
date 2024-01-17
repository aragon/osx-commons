import {networks} from '.';
import {SupportedNetworks, SupportedAliases} from './types';

/**
 * Returns the network alias
 *
 * @export
 * @param {SupportedNetworks} network
 * @param {SupportedAliases} alias
 * @return {*}  {string}
 */
export function getNetworkAlias(
  network: SupportedNetworks,
  alias: SupportedAliases
): string {
  return networks[network].aliases[alias] || network;
}
/**
 * Returns the network name from the alias
 *
 * @export
 * @param {string} alias
 * @param {SupportedAliases} aliasName
 * @return {*}  {(SupportedNetworks | undefined)}
 */
export function getNetworkNameFromAlias(
  alias: string,
  aliasName: SupportedAliases
): SupportedNetworks | undefined {
  const networkNames = Object.keys(networks) as SupportedNetworks[];
  return networkNames.find(
    networkName =>
      networks[networkName].aliases[aliasName] === alias ||
      networkName === alias
  );
}
