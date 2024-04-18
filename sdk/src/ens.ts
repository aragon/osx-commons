import {InvalidEnsError, UnsupportedNetworkError} from './errors';
import {getNetworkByAlias} from '@aragon/osx-commons-configs';
import {Networkish} from '@ethersproject/networks';
import {JsonRpcProvider, Provider} from '@ethersproject/providers';

const ENS_REGEX = /^(?:[a-z0-9-]+\.)*[a-z0-9-]+\.eth$/;
const SUBDOMAIN_REGEX = /^[a-z0-9-]+$/;

/**
 * Resolves an ENS name to an address given a provider
 *
 * @export
 * @param {string} ensName
 * @param {Provider | Networkish} providerOrNetwork
 * @return {(Promise<string | null>)}
 */
export function resolveEnsName(
  ensName: string,
  providerOrNetwork: Provider | Networkish
): Promise<string | null> {
  // check if the ensName is valid
  if (!isEnsName(ensName)) {
    throw new InvalidEnsError(ensName);
  }
  let provider: Provider;
  // check if the providerOrNetwork is a provider or a network
  // if it's a provider, use it
  if (providerOrNetwork instanceof Provider) {
    provider = providerOrNetwork;
    // any other case, assume it's a network and create a provider
  } else {
    const aragonNetwork = getNetworkByAlias(providerOrNetwork.toString());
    if (!aragonNetwork) {
      throw new UnsupportedNetworkError(providerOrNetwork.toString());
    }
    provider = new JsonRpcProvider(aragonNetwork.url, providerOrNetwork);
  }
  return provider.resolveName(ensName);
}
/**
 * Checks if the given string is a valid ENS name
 *
 * @export
 * @param {string} name
 * @return {*}  {boolean}
 */
export function isEnsName(name: string): boolean {
  return ENS_REGEX.test(name);
}
/**
 * Checks if the given string is a valid subdomain
 *
 * @export
 * @param {string} name
 * @return {*}  {boolean}
 */
export function isSubdomain(name: string): boolean {
  return SUBDOMAIN_REGEX.test(name);
}
