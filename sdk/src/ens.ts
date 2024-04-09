import {ethers} from 'ethers';
import {InvalidEnsError, UnsupportedNetworkError} from './errors';
import {getNetworkByAlias} from '@aragon/osx-commons-configs';
import {Networkish} from '@ethersproject/networks';
import {JsonRpcProvider, Provider} from '@ethersproject/providers';
import {ENS_REGEX, SUBDOMAIN_REGEX} from './constants';

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
 * Checks if the given name is a valid ENS subdomain for Aragon OSx.
 * See https://devs.aragon.org/docs/osx/how-it-works/framework/ens-names for more info
 *
 * @export
 * @param {string} name
 * @return {*}  {boolean}
 */
export function isSubdomain(name: string): boolean {
  const regex = new RegExp(SUBDOMAIN_REGEX);
  return regex.test(name);
}

/**
 * Checks if the given name is a valid ENS domain for Aragon OSx.
 *
 * @export
 * @param {string} name
 * @return {*}  {boolean}
 */
export function isEnsName(name: string): boolean {
  const regex = new RegExp(ENS_REGEX);
  return regex.test(name);
}

/**
 * Returns the ENS labelhash of a given subdomain.
 * See https://docs.ens.domains/resolution/names#labelhash for more info.
 *
 * @export
 * @param {string} label
 * @return {*}  {string}
 */
export function ensLabelHash(label: string): string {
  return ethers.utils.id(label);
}

/**
 * Returns the ENS namehash of a given domain.
 * See https://docs.ens.domains/resolution/names#namehash for more info.
 *
 * @export
 * @param {string} label
 * @return {*}  {string}
 */
export function ensDomainHash(name: string): string {
  return ethers.utils.namehash(name);
}
