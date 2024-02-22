import {InvalidEnsError, UnsupportedNetworkError} from '../errors';
import {isEnsName} from '../validation';
import {getNetworkByAlias} from '@aragon/osx-commons-configs';
import {Networkish} from '@ethersproject/networks';
import {JsonRpcProvider} from '@ethersproject/providers';

export function resolveEnsName(
  ensName: string,
  provider: JsonRpcProvider
): Promise<string | null> {
  if (!isEnsName(ensName)) {
    throw new InvalidEnsError(ensName);
  }
  return provider.resolveName(ensName);
}

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
