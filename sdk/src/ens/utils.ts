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
  provider: JsonRpcProvider
): Promise<string | null> {
  if (!isEnsName(ensName)) {
    throw new InvalidEnsError(ensName);
  }
  return provider.resolveName(ensName);
}

/**
 * Resolves an ENS name to an address given a network
 *
 * @export
 * @param {string} ensName
 * @param {Networkish} network
 * @return {(Promise<string | null>)}
 */
export function resolveEnsNameWithProvider(
  ensName: string,
  network: Networkish
): Promise<string | null> {
  const aragonNetwork = getNetworkByAlias(network.toString());
  if (!aragonNetwork) {
    throw new UnsupportedNetworkError(network.toString());
  }
  const provider = new JsonRpcProvider(aragonNetwork.url, network);
  return resolveEnsName(ensName, provider);
}
