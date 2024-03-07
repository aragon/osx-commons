import {GRAPHQL_NODES, IPFS_NODES, LIVE_CONTRACTS} from './constants';
import {
  InvalidGasEstimationFactorError,
  UnsupportedNetworkError,
  UnsupportedProtocolError,
} from './errors';
import {InvalidAddressError} from './hex';
import {DeployedAddressesArray} from './internal';
import {
  ContextParams,
  ContextState,
  OverriddenState,
  SupportedNetwork,
  SupportedNetworksArray,
  SupportedVersion,
} from './types';
import {getNetwork} from './utils';
import {Client as IpfsClient} from '@aragon/sdk-ipfs';
import {Signer} from '@ethersproject/abstract-signer';
import {isAddress} from '@ethersproject/address';
import {JsonRpcProvider, Network, Networkish} from '@ethersproject/providers';
import {GraphQLClient} from 'graphql-request';

const DEFAULT_GAS_FEE_ESTIMATION_FACTOR = 0.625;
const supportedProtocols = ['https:'];
if (typeof process !== 'undefined' && process?.env?.TESTING) {
  supportedProtocols.push('http:');
}

export abstract class ContextCore {
  protected state: ContextState = {} as ContextState;
  protected overriden: OverriddenState = {
    daoFactoryAddress: false,
    pluginSetupProcessorAddress: false,
    multisigRepoAddress: false,
    adminRepoAddress: false,
    addresslistVotingRepoAddress: false,
    tokenVotingRepoAddress: false,
    multisigSetupAddress: false,
    adminSetupAddress: false,
    addresslistVotingSetupAddress: false,
    tokenVotingSetupAddress: false,
    ensRegistryAddress: false,
    gasFeeEstimationFactor: false,
    ipfsNodes: false,
    graphqlNodes: false,
  };
  // INTERNAL CONTEXT STATE
  /**
   * @param {Object} params
   *
   * @constructor
   */
  constructor(params?: Partial<ContextParams>) {
    // set network to mainnet, overrided by the value of params
    const mergedParams = Object.assign({network: 'mainnet'}, params);
    this.set(mergedParams);
  }

  set(contextParams: Partial<ContextParams>) {
    if (contextParams.network) {
      this.state.network = ContextCore.resolveNetwork(
        contextParams.network,
        contextParams.ensRegistryAddress
      );
      // once the network is resolved set default values
      this.setNetworkDefaults();
    }
    if (contextParams.signer) {
      this.state.signer = contextParams.signer;
    }
    if (
      contextParams.web3Providers ||
      (Array.isArray(contextParams.web3Providers) &&
        contextParams.web3Providers.length)
    ) {
      this.state.web3Providers = ContextCore.resolveWeb3Providers(
        contextParams.web3Providers,
        this.state.network
      );
    }
    if (contextParams.graphqlNodes?.length) {
      this.state.graphql = ContextCore.resolveGraphql(
        contextParams.graphqlNodes
      );
      this.overriden.graphqlNodes = true;
    }
    if (contextParams.ipfsNodes?.length) {
      this.state.ipfs = ContextCore.resolveIpfs(contextParams.ipfsNodes);
      this.overriden.ipfsNodes = true;
    }
    // Set all the available addresses
    for (const address of DeployedAddressesArray) {
      if (contextParams[address]) {
        this.state[address] = contextParams[address] ?? '';
        this.overriden[address] = true;
      }
    }

    if (contextParams.gasFeeEstimationFactor) {
      this.state.gasFeeEstimationFactor =
        ContextCore.resolveGasFeeEstimationFactor(
          contextParams.gasFeeEstimationFactor
        );
      this.overriden.gasFeeEstimationFactor = true;
    }
  }

  private setNetworkDefaults() {
    const networkName = this.network.name as SupportedNetwork;
    if (
      !GRAPHQL_NODES[networkName]?.length ||
      !IPFS_NODES[networkName]?.length ||
      !LIVE_CONTRACTS[SupportedVersion.LATEST][networkName]
    ) {
      throw new UnsupportedNetworkError(networkName);
    }

    if (!this.overriden.graphqlNodes) {
      this.state.graphql = ContextCore.resolveGraphql(
        GRAPHQL_NODES[networkName]
      );
    }

    if (!this.overriden.ipfsNodes) {
      this.state.ipfs = ContextCore.resolveIpfs(IPFS_NODES[networkName]);
    }

    for (const address of DeployedAddressesArray) {
      if (!this.overriden[address]) {
        let defaultAddress =
          LIVE_CONTRACTS[SupportedVersion.LATEST][networkName][address];
        // custom check for ensRegistryAddress
        if (address === 'ensRegistryAddress' && !defaultAddress) {
          defaultAddress = this.network.ensAddress;
        }
        if (defaultAddress) {
          this.state[address] = defaultAddress;
        }
      }
    }

    if (!this.overriden.gasFeeEstimationFactor) {
      this.state.gasFeeEstimationFactor = DEFAULT_GAS_FEE_ESTIMATION_FACTOR;
    }
  }

  // GETTERS

  /**
   * Getter for the network
   *
   * @var network
   *
   * @returns {Networkish}
   *
   * @public
   */
  get network() {
    return this.state.network;
  }
  /**
   * Getter for the Signer
   *
   * @var signer
   *
   * @returns {Signer}
   *
   * @public
   */
  get ensRegistryAddress(): string | undefined {
    return this.state.ensRegistryAddress;
  }

  /**
   * Getter for the Signer
   *
   * @var signer
   *
   * @returns {Signer}
   *
   * @public
   */
  get signer(): Signer {
    return this.state.signer;
  }

  /**
   * Getter for the web3 providers
   *
   * @var web3Providers
   *
   * @returns {JsonRpcProvider[]}
   *
   * @public
   */
  get web3Providers(): JsonRpcProvider[] {
    return this.state.web3Providers || [];
  }

  /**
   * Getter for daoFactoryAddress property
   *
   * @var daoFactoryAddress
   *
   * @returns {string}
   *
   * @public
   */
  get daoFactoryAddress(): string {
    return this.state.daoFactoryAddress;
  }

  /**
   * Getter for pluginSetupProcessorAddress property
   * @var pluginSetupProcessorAddress
   * @returns {string}
   * @public
   */
  get pluginSetupProcessorAddress(): string {
    return this.state.pluginSetupProcessorAddress;
  }
  /**
   * Getter for multisigRepoAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get multisigRepoAddress(): string {
    return this.state.multisigRepoAddress;
  }
  /**
   * Getter for adminRepoAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get adminRepoAddress(): string {
    return this.state.adminRepoAddress;
  }
  /**
   * Getter for addresslistVotingRepoAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get addresslistVotingRepoAddress(): string {
    return this.state.addresslistVotingRepoAddress;
  }
  /**
   * Getter for tokenVotingRepoAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get tokenVotingRepoAddress(): string {
    return this.state.tokenVotingRepoAddress;
  }
  /**
   * Getter for multisigSetupAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get multisigSetupAddress(): string {
    return this.state.multisigSetupAddress;
  }
  /**
   * Getter for adminSetupAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get adminSetupAddress(): string {
    return this.state.adminSetupAddress;
  }
  /**
   * Getter for addresslistVotingSetupAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get addresslistVotingSetupAddress(): string {
    return this.state.addresslistVotingSetupAddress;
  }
  /**
   * Getter for tokenVotingSetupAddress property
   *
   * @readonly
   * @type {string}
   * @memberof ContextCore
   */
  get tokenVotingSetupAddress(): string {
    return this.state.tokenVotingSetupAddress;
  }

  /**
   * Getter for the gas fee reducer used in estimations
   *
   * @var gasFeeEstimationFactor
   *
   * @returns {number}
   *
   * @public
   */
  get gasFeeEstimationFactor(): number {
    return this.state.gasFeeEstimationFactor;
  }

  /**
   * Getter for the IPFS http client
   *
   * @var ipfs
   *
   * @returns {IpfsClient[]}
   *
   * @public
   */
  get ipfs(): IpfsClient[] {
    return this.state.ipfs;
  }

  /**
   * Getter for the GraphQL client
   *
   * @var graphql
   *
   * @returns {GraphQLClient[]}
   *
   * @public
   */
  get graphql(): GraphQLClient[] {
    return this.state.graphql;
  }

  // INTERNAL HELPERS
  private static resolveNetwork(
    networkish: Networkish,
    ensRegistryAddress?: string
  ): Network {
    const network = getNetwork(networkish);
    const networkName = network.name as SupportedNetwork;
    if (!SupportedNetworksArray.includes(networkName)) {
      throw new UnsupportedNetworkError(networkName);
    }

    if (ensRegistryAddress) {
      if (!isAddress(ensRegistryAddress)) {
        throw new InvalidAddressError(ensRegistryAddress);
      } else {
        network.ensAddress = ensRegistryAddress;
      }
    }

    if (!network.ensAddress) {
      const ensAddress =
        LIVE_CONTRACTS[SupportedVersion.LATEST][networkName].ensRegistryAddress;
      if (!ensAddress) {
        throw new UnsupportedNetworkError(networkName);
      }
      network.ensAddress = ensAddress;
    }
    return network;
  }

  private static resolveWeb3Providers(
    endpoints: string | JsonRpcProvider | (string | JsonRpcProvider)[],
    network: Network
  ): JsonRpcProvider[] {
    if (Array.isArray(endpoints)) {
      return endpoints.map(item => {
        if (typeof item === 'string') {
          const url = new URL(item);
          if (!supportedProtocols.includes(url.protocol)) {
            throw new UnsupportedProtocolError(url.protocol);
          }
          return new JsonRpcProvider(url.href, network);
        }
        return item;
      });
    } else if (typeof endpoints === 'string') {
      const url = new URL(endpoints);
      if (!supportedProtocols.includes(url.protocol)) {
        throw new UnsupportedProtocolError(url.protocol);
      }
      return [new JsonRpcProvider(url.href, network)];
    } else {
      return [endpoints];
    }
  }

  private static resolveIpfs(
    configs: {
      url: string;
      headers?: Record<string, string>;
    }[]
  ): IpfsClient[] {
    const clients: IpfsClient[] = [];
    configs.forEach(config => {
      const url = new URL(config.url);
      if (!supportedProtocols.includes(url.protocol)) {
        throw new UnsupportedProtocolError(url.protocol);
      }
      clients.push(new IpfsClient(url, config.headers));
    });
    return clients;
  }

  private static resolveGraphql(endpoints: {url: string}[]): GraphQLClient[] {
    const clients: GraphQLClient[] = [];
    endpoints.forEach(endpoint => {
      const url = new URL(endpoint.url);
      if (!supportedProtocols.includes(url.protocol)) {
        throw new UnsupportedProtocolError(url.protocol);
      }
      clients.push(new GraphQLClient(url.href));
    });
    return clients;
  }

  private static resolveGasFeeEstimationFactor(
    gasFeeEstimationFactor: number
  ): number {
    if (gasFeeEstimationFactor < 0 || gasFeeEstimationFactor > 1) {
      throw new InvalidGasEstimationFactorError();
    }
    return gasFeeEstimationFactor;
  }
}
