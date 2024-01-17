import {networks} from '.';
import {SupportedNetworks, SupportedAliases} from './types';

/**
 *
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
 *
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
  const supportedNetworks = Object.keys(networks) as SupportedNetworks[];
  return supportedNetworks.find(n => networks[n].aliases[aliasName] === alias);
}
