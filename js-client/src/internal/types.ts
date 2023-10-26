import {Client as IpfsClient} from '@aragon/sdk-ipfs';
import {Signer} from '@ethersproject/abstract-signer';
import {JsonRpcProvider, Network, Networkish} from '@ethersproject/providers';
import {GraphQLClient} from 'graphql-request';

// Create a readonly string array from the keys of NetworkDeployment
export const DeployedAddressesArray = [
  'daoFactoryAddress',
  'pluginSetupProcessorAddress',
  'multisigRepoAddress',
  'adminRepoAddress',
  'addresslistVotingRepoAddress',
  'tokenVotingRepoAddress',
  'multisigSetupAddress',
  'adminSetupAddress',
  'addresslistVotingSetupAddress',
  'tokenVotingSetupAddress',
  'ensRegistryAddress',
] as const;
// export the type from the readonly string array
export type DeployedAddresses = (typeof DeployedAddressesArray)[number];
// Override helper type
type Override<T, U> = Omit<T, keyof U> & U;
export type NetworkDeployment = Override<
  {
    [address in DeployedAddresses]: string;
  },
  {ensRegistryAddress?: string}
>;
// Context input parameters

export type Web3ContextParams =
  /** If any contract is not provided it will use the default from LIVE_CONTRACTS in the provided network */
  {
    [address in DeployedAddresses]?: string;
  } & {
    /** Defaults to mainnet */
    network?: Networkish;
    /** Required for Ethereum transactions to work */
    signer?: Signer;
    /** Required for Ethereum connectivity to work */
    web3Providers?: string | JsonRpcProvider | (string | JsonRpcProvider)[];
    gasFeeEstimationFactor?: number;
  };
export type IpfsContextParams = {
  /** If not provided uses default value */
  ipfsNodes?: {url: string; headers?: Record<string, string>}[];
};
export type GraphQLContextParams = {
  /** If not provided uses default value */
  graphqlNodes?: {url: string}[];
};

export type Web3ContextState = Override<
  {
    [address in DeployedAddresses]: string;
  },
  {ensRegistryAddress?: string}
> & {
  network: Network;
  signer: Signer;
  web3Providers: JsonRpcProvider[];
  gasFeeEstimationFactor: number;
};
export type IpfsContextState = {
  ipfs: IpfsClient[];
};
export type GraphQLContextState = {
  graphql: GraphQLClient[];
};

export type SubgraphPluginInstallation = {
  appliedVersion: SubgraphPluginVersion;
  appliedPreparation: SubgraphPluginPreparation;
};

export type SubgraphPluginVersion = {
  release: {
    release: number;
  };
  metadata: string;
  build: number;
};

export type SubgraphPluginPreparation = {
  helpers: string[];
  pluginRepo: {
    id: string;
  };
};
