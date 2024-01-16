import {networks} from '.';
import {SupportedNetworks, SupportedAliases} from './types';

export function getNetworkAlias(
  network: SupportedNetworks,
  alias: SupportedAliases
): string {
  return networks[network].aliases[alias] || network;
}
