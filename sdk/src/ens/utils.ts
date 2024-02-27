import {InvalidEnsError, UnsupportedNetworkError} from '../errors';
import {isEnsName} from '../validation';
import {getNetworkByAlias} from '@aragon/osx-commons-configs';
import {Networkish} from '@ethersproject/networks';
import {JsonRpcProvider} from '@ethersproject/providers';

/**
 * Resolves an ENS name to an address given a provider
 *
 * @export
 * @param {string} ensName
 * @param {JsonRpcProvider} provider
 * @return {(Promise<string | null>)}
 */
export function resolveEnsName(
  ensName: string,
  providerOrNetwork: JsonRpcProvider | Networkish
): Promise<string | null> {
  // check if the ensName is valid
  if (!isEnsName(ensName)) {
    throw new InvalidEnsError(ensName);
  }
  let provider: JsonRpcProvider;
  // check if the providerOrNetwork is a provider or a network
  // if it's a provider, use it
  if (providerOrNetwork instanceof JsonRpcProvider) {
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
