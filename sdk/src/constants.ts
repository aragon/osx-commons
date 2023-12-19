import {NetworkDeployment} from './internal';
import {ProposalMetadata, SupportedNetwork, SupportedVersion} from './types';
import {activeContractsList} from '@aragon/osx-ethers';
import {activeContractsList as activeContractsListV1_0_0} from '@aragon/osx-ethers-v1.0.0';
import {keccak256} from '@ethersproject/keccak256';
import {Network} from '@ethersproject/networks';
import {toUtf8Bytes} from '@ethersproject/strings';

export const TIME = {
  SECOND: 1,
  get MINUTE() {
    return 60 * this.SECOND;
  },
  get HOUR() {
    return 60 * this.MINUTE;
  },
  get DAY() {
    return 24 * this.HOUR;
  },
  get WEEK() {
    return 7 * this.DAY;
  },
  get YEAR() {
    return 365 * this.DAY;
  },
};

function toMilliseconds(seconds: number) {
  return seconds * 1000;
}

/** Timeout that will be applied to operations involving
 * many fetch requests that could take a long time */
export const MULTI_FETCH_TIMEOUT = toMilliseconds(7 * TIME.SECOND);

type GraphqlNetworks =
  | 'mainnet'
  | 'goerli'
  | 'sepolia'
  | 'polygon'
  | 'mumbai'
  | 'baseMainnet'
  | 'baseGoerli'
  | 'arbitrum'
  | 'arbitrumGoerli'
  | 'local';

const SupportedNetworksToGraphqlNetworks: {
  [K in SupportedNetwork]: GraphqlNetworks;
} = {
  [SupportedNetwork.MAINNET]: 'mainnet',
  [SupportedNetwork.GOERLI]: 'goerli',
  [SupportedNetwork.SEPOLIA]: 'sepolia',
  [SupportedNetwork.POLYGON]: 'polygon',
  [SupportedNetwork.MUMBAI]: 'mumbai',
  [SupportedNetwork.BASE]: 'baseMainnet',
  [SupportedNetwork.BASE_GOERLI]: 'baseGoerli',
  [SupportedNetwork.ARBITRUM]: 'arbitrum',
  [SupportedNetwork.ARBITRUM_GOERLI]: 'arbitrumGoerli',
  [SupportedNetwork.LOCAL]: 'local',
};

export const UNSUPPORTED_PROPOSAL_METADATA_LINK: ProposalMetadata = {
  title: '(unsupported metadata link)',
  summary: '(the link to the metadata is not supported)',
  description: '(the link to the metadata is not supported)',
  resources: [],
};
export const EMPTY_PROPOSAL_METADATA_LINK: ProposalMetadata = {
  title: '(the proposal has no metadata)',
  summary: '(the current proposal does not have any content defined)',
  description: '(the current proposal does not have any content defined)',
  resources: [],
};
export const UNAVAILABLE_PROPOSAL_METADATA: ProposalMetadata = {
  title: '(unavailable metadata)',
  summary: '(the proposal metadata is not available)',
  description: '(the proposal metadata is not available)',
  resources: [],
};

const getGraphqlNode = (network: SupportedNetwork): string => {
  return `https://subgraph.satsuma-prod.com/qHR2wGfc5RLi6/aragon/osx-${SupportedNetworksToGraphqlNetworks[network]}/version/v1.3.0/api`;
};

export const GRAPHQL_NODES: {[K in SupportedNetwork]: {url: string}[]} = {
  [SupportedNetwork.MAINNET]: [
    {
      url: getGraphqlNode(SupportedNetwork.MAINNET),
    },
  ],
  [SupportedNetwork.GOERLI]: [{url: getGraphqlNode(SupportedNetwork.GOERLI)}],
  [SupportedNetwork.SEPOLIA]: [
    {
      url: getGraphqlNode(SupportedNetwork.SEPOLIA),
    },
  ],
  [SupportedNetwork.POLYGON]: [
    {
      url: getGraphqlNode(SupportedNetwork.POLYGON),
    },
  ],
  [SupportedNetwork.MUMBAI]: [{url: getGraphqlNode(SupportedNetwork.MUMBAI)}],
  [SupportedNetwork.BASE]: [{url: getGraphqlNode(SupportedNetwork.BASE)}],
  [SupportedNetwork.BASE_GOERLI]: [
    {
      url: getGraphqlNode(SupportedNetwork.BASE_GOERLI),
    },
  ],
  [SupportedNetwork.ARBITRUM]: [
    {url: getGraphqlNode(SupportedNetwork.ARBITRUM)},
  ],
  [SupportedNetwork.ARBITRUM_GOERLI]: [
    {
      url: getGraphqlNode(SupportedNetwork.ARBITRUM_GOERLI),
    },
  ],
  [SupportedNetwork.LOCAL]: [{url: getGraphqlNode(SupportedNetwork.LOCAL)}],
};

const IPFS_ENDPOINTS = {
  prod: [
    {
      url: 'https://prod.ipfs.aragon.network/api/v0',
      headers: {
        'X-API-KEY': 'b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt',
      },
    },
  ],
  test: [
    {
      url: 'https://test.ipfs.aragon.network/api/v0',
      headers: {
        'X-API-KEY': 'b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt',
      },
    },
  ],
};

export const IPFS_NODES: {
  [K in SupportedNetwork]: {
    url: string;
    headers?: Record<string, string> | undefined;
  }[];
} = {
  [SupportedNetwork.MAINNET]: IPFS_ENDPOINTS.prod,
  [SupportedNetwork.GOERLI]: IPFS_ENDPOINTS.test,
  [SupportedNetwork.SEPOLIA]: IPFS_ENDPOINTS.test,
  [SupportedNetwork.POLYGON]: IPFS_ENDPOINTS.prod,
  [SupportedNetwork.MUMBAI]: IPFS_ENDPOINTS.test,
  [SupportedNetwork.BASE]: IPFS_ENDPOINTS.prod,
  [SupportedNetwork.BASE_GOERLI]: IPFS_ENDPOINTS.test,
  [SupportedNetwork.ARBITRUM]: IPFS_ENDPOINTS.prod,
  [SupportedNetwork.ARBITRUM_GOERLI]: IPFS_ENDPOINTS.test,
  [SupportedNetwork.LOCAL]: IPFS_ENDPOINTS.test,
};

const NOT_DEPLOYED = {
  daoFactoryAddress: '',
  pluginSetupProcessorAddress: '',
  multisigRepoAddress: '',
  adminRepoAddress: '',
  addresslistVotingRepoAddress: '',
  tokenVotingRepoAddress: '',
  multisigSetupAddress: '',
  adminSetupAddress: '',
  addresslistVotingSetupAddress: '',
  tokenVotingSetupAddress: '',
  ensRegistryAddress: '',
};

export const LIVE_CONTRACTS: {
  [J in SupportedVersion]: {[K in SupportedNetwork]: NetworkDeployment};
} = {
  [SupportedVersion.V1_0_0]: {
    [SupportedNetwork.MAINNET]: {
      daoFactoryAddress: activeContractsListV1_0_0.mainnet.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsListV1_0_0.mainnet.PluginRepoFactory,
      multisigRepoAddress: activeContractsListV1_0_0.mainnet['multisig-repo'],
      adminRepoAddress: activeContractsListV1_0_0.mainnet['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsListV1_0_0.mainnet['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsListV1_0_0.mainnet['token-voting-repo'],
      multisigSetupAddress: activeContractsListV1_0_0.mainnet.MultisigSetup,
      adminSetupAddress: activeContractsListV1_0_0.mainnet.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsListV1_0_0.mainnet.AddresslistVotingSetup,
      tokenVotingSetupAddress:
        activeContractsListV1_0_0.mainnet.TokenVotingSetup,
    },
    [SupportedNetwork.GOERLI]: {
      daoFactoryAddress: activeContractsListV1_0_0.goerli.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsListV1_0_0.goerli.PluginSetupProcessor,
      multisigRepoAddress: activeContractsListV1_0_0.goerli['multisig-repo'],
      adminRepoAddress: activeContractsListV1_0_0.goerli['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsListV1_0_0.goerli['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsListV1_0_0.goerli['token-voting-repo'],
      multisigSetupAddress: activeContractsListV1_0_0.goerli.MultisigSetup,
      adminSetupAddress: activeContractsListV1_0_0.goerli.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsListV1_0_0.goerli.AddresslistVotingSetup,
      tokenVotingSetupAddress:
        activeContractsListV1_0_0.goerli.TokenVotingSetup,
    },
    [SupportedNetwork.SEPOLIA]: NOT_DEPLOYED,
    [SupportedNetwork.POLYGON]: {
      daoFactoryAddress: activeContractsListV1_0_0.polygon.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsListV1_0_0.polygon.PluginSetupProcessor,
      multisigRepoAddress: activeContractsListV1_0_0.polygon['multisig-repo'],
      adminRepoAddress: activeContractsListV1_0_0.polygon['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsListV1_0_0.polygon['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsListV1_0_0.polygon['token-voting-repo'],
      multisigSetupAddress: activeContractsListV1_0_0.polygon.MultisigSetup,
      adminSetupAddress: activeContractsListV1_0_0.polygon.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsListV1_0_0.polygon.AddresslistVotingSetup,
      tokenVotingSetupAddress:
        activeContractsListV1_0_0.polygon.TokenVotingSetup,
      ensRegistryAddress: activeContractsListV1_0_0.polygon.ENSRegistry,
    },
    [SupportedNetwork.MUMBAI]: {
      daoFactoryAddress: activeContractsListV1_0_0.mumbai.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsListV1_0_0.mumbai.PluginSetupProcessor,
      multisigRepoAddress: activeContractsListV1_0_0.mumbai['multisig-repo'],
      adminRepoAddress: activeContractsListV1_0_0.mumbai['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsListV1_0_0.mumbai['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsListV1_0_0.mumbai['token-voting-repo'],
      multisigSetupAddress: activeContractsListV1_0_0.mumbai.MultisigSetup,
      adminSetupAddress: activeContractsListV1_0_0.mumbai.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsListV1_0_0.mumbai.AddresslistVotingSetup,
      tokenVotingSetupAddress:
        activeContractsListV1_0_0.mumbai.TokenVotingSetup,
      ensRegistryAddress: activeContractsListV1_0_0.mumbai.ENSRegistry,
    },
    [SupportedNetwork.BASE]: NOT_DEPLOYED,
    [SupportedNetwork.BASE_GOERLI]: NOT_DEPLOYED,
    [SupportedNetwork.ARBITRUM]: NOT_DEPLOYED,
    [SupportedNetwork.ARBITRUM_GOERLI]: NOT_DEPLOYED,
    [SupportedNetwork.LOCAL]: NOT_DEPLOYED,
  },
  [SupportedVersion.V1_3_0]: {
    [SupportedNetwork.MAINNET]: {
      daoFactoryAddress: activeContractsList.mainnet.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.mainnet.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.mainnet['multisig-repo'],
      adminRepoAddress: activeContractsList.mainnet['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.mainnet['address-list-voting-repo'],
      tokenVotingRepoAddress: activeContractsList.mainnet['token-voting-repo'],
      multisigSetupAddress: activeContractsList.mainnet.MultisigSetup,
      adminSetupAddress: activeContractsList.mainnet.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.mainnet.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.mainnet.TokenVotingSetup,
    },
    [SupportedNetwork.GOERLI]: {
      daoFactoryAddress: activeContractsList.goerli.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.goerli.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.goerli['multisig-repo'],
      adminRepoAddress: activeContractsList.goerli['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.goerli['address-list-voting-repo'],
      tokenVotingRepoAddress: activeContractsList.goerli['token-voting-repo'],
      multisigSetupAddress: activeContractsList.goerli.MultisigSetup,
      adminSetupAddress: activeContractsList.goerli.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.goerli.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.goerli.TokenVotingSetup,
    },
    [SupportedNetwork.SEPOLIA]: {
      daoFactoryAddress: activeContractsList.sepolia.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.sepolia.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.sepolia['multisig-repo'],
      adminRepoAddress: activeContractsList.sepolia['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.sepolia['address-list-voting-repo'],
      tokenVotingRepoAddress: activeContractsList.sepolia['token-voting-repo'],
      multisigSetupAddress: activeContractsList.sepolia.MultisigSetup,
      adminSetupAddress: activeContractsList.sepolia.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.sepolia.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.sepolia.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.sepolia.ENSRegistry,
    },
    [SupportedNetwork.POLYGON]: {
      daoFactoryAddress: activeContractsList.polygon.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.polygon.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.polygon['multisig-repo'],
      adminRepoAddress: activeContractsList.polygon['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.polygon['address-list-voting-repo'],
      tokenVotingRepoAddress: activeContractsList.polygon['token-voting-repo'],
      multisigSetupAddress: activeContractsList.polygon.MultisigSetup,
      adminSetupAddress: activeContractsList.polygon.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.polygon.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.polygon.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.polygon.ENSRegistry,
    },
    [SupportedNetwork.MUMBAI]: {
      daoFactoryAddress: activeContractsList.mumbai.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.mumbai.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.mumbai['multisig-repo'],
      adminRepoAddress: activeContractsList.mumbai['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.mumbai['address-list-voting-repo'],
      tokenVotingRepoAddress: activeContractsList.mumbai['token-voting-repo'],
      multisigSetupAddress: activeContractsList.mumbai.MultisigSetup,
      adminSetupAddress: activeContractsList.mumbai.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.mumbai.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.mumbai.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.mumbai.ENSRegistry,
    },
    [SupportedNetwork.BASE]: {
      daoFactoryAddress: activeContractsList.baseMainnet.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.baseMainnet.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.baseMainnet['multisig-repo'],
      adminRepoAddress: activeContractsList.baseMainnet['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.baseMainnet['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsList.baseMainnet['token-voting-repo'],
      multisigSetupAddress: activeContractsList.baseMainnet.MultisigSetup,
      adminSetupAddress: activeContractsList.baseMainnet.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.baseMainnet.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.baseMainnet.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.baseMainnet.ENSRegistry,
    },
    [SupportedNetwork.BASE_GOERLI]: {
      daoFactoryAddress: activeContractsList.baseGoerli.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.baseGoerli.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.baseGoerli['multisig-repo'],
      adminRepoAddress: activeContractsList.baseGoerli['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.baseGoerli['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsList.baseGoerli['token-voting-repo'],
      multisigSetupAddress: activeContractsList.baseGoerli.MultisigSetup,
      adminSetupAddress: activeContractsList.baseGoerli.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.baseGoerli.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.baseGoerli.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.baseGoerli.ENSRegistry,
    },
    [SupportedNetwork.ARBITRUM]: {
      daoFactoryAddress: activeContractsList.arbitrum.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.arbitrum.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.arbitrum['multisig-repo'],
      adminRepoAddress: activeContractsList.arbitrum['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.arbitrum['address-list-voting-repo'],
      tokenVotingRepoAddress: activeContractsList.arbitrum['token-voting-repo'],
      multisigSetupAddress: activeContractsList.arbitrum.MultisigSetup,
      adminSetupAddress: activeContractsList.arbitrum.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.arbitrum.AddresslistVotingSetup,
      tokenVotingSetupAddress: activeContractsList.arbitrum.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.arbitrum.ENSRegistry,
    },
    [SupportedNetwork.ARBITRUM_GOERLI]: {
      daoFactoryAddress: activeContractsList.arbitrumGoerli.DAOFactory,
      pluginSetupProcessorAddress:
        activeContractsList.arbitrumGoerli.PluginSetupProcessor,
      multisigRepoAddress: activeContractsList.arbitrumGoerli['multisig-repo'],
      adminRepoAddress: activeContractsList.arbitrumGoerli['admin-repo'],
      addresslistVotingRepoAddress:
        activeContractsList.arbitrumGoerli['address-list-voting-repo'],
      tokenVotingRepoAddress:
        activeContractsList.arbitrumGoerli['token-voting-repo'],
      multisigSetupAddress: activeContractsList.arbitrumGoerli.MultisigSetup,
      adminSetupAddress: activeContractsList.arbitrumGoerli.AdminSetup,
      addresslistVotingSetupAddress:
        activeContractsList.arbitrumGoerli.AddresslistVotingSetup,
      tokenVotingSetupAddress:
        activeContractsList.arbitrumGoerli.TokenVotingSetup,
      ensRegistryAddress: activeContractsList.arbitrumGoerli.ENSRegistry,
    },
    [SupportedNetwork.LOCAL]: NOT_DEPLOYED,
  },
};
export const ADDITIONAL_NETWORKS: Network[] = [
  {
    name: 'sepolia',
    chainId: 11155111,
  },
  {
    name: 'arbitrum',
    chainId: 42161,
  },
  {
    name: 'arbitrumGoerli',
    chainId: 421613,
  },
  {
    name: 'base',
    chainId: 8453,
  },
  {
    name: 'baseGoerli',
    chainId: 84531,
  },
  {
    name: 'local',
    chainId: 31337,
  },
];

const Permissions = {
  UPGRADE_PERMISSION: 'UPGRADE_PERMISSION',
  SET_METADATA_PERMISSION: 'SET_METADATA_PERMISSION',
  EXECUTE_PERMISSION: 'EXECUTE_PERMISSION',
  WITHDRAW_PERMISSION: 'WITHDRAW_PERMISSION',
  SET_SIGNATURE_VALIDATOR_PERMISSION: 'SET_SIGNATURE_VALIDATOR_PERMISSION',
  SET_TRUSTED_FORWARDER_PERMISSION: 'SET_TRUSTED_FORWARDER_PERMISSION',
  ROOT_PERMISSION: 'ROOT_PERMISSION',
  CREATE_VERSION_PERMISSION: 'CREATE_VERSION_PERMISSION',
  REGISTER_PERMISSION: 'REGISTER_PERMISSION',
  REGISTER_DAO_PERMISSION: 'REGISTER_DAO_PERMISSION',
  REGISTER_ENS_SUBDOMAIN_PERMISSION: 'REGISTER_ENS_SUBDOMAIN_PERMISSION',
  MINT_PERMISSION: 'MINT_PERMISSION',
  MERKLE_MINT_PERMISSION: 'MERKLE_MINT_PERMISSION',
  MODIFY_ALLOWLIST_PERMISSION: 'MODIFY_ALLOWLIST_PERMISSION',
  SET_CONFIGURATION_PERMISSION: 'SET_CONFIGURATION_PERMISSION',
};

const PermissionIds = Object.entries(Permissions).reduce(
  (acc, [k, v]) => ({...acc, [k + '_ID']: keccak256(toUtf8Bytes(v))}),
  {} as {[k: string]: string}
);
Object.freeze(Permissions);
export {Permissions};
Object.freeze(PermissionIds);
export {PermissionIds};
export const IPFS_CID_REGEX =
  /^((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

export const IPFS_URI_REGEX =
  /^ipfs:\/\/((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;
export const OSX_PROPOSAL_ID_REGEX =
  /^(0x[A-Fa-f0-9]{40})_(0x[A-Fa-f0-9]{1,64})$/;
export const HEX_STRING_REGEX = /^(0x)?[0-9a-fA-F]*$/;
export const ENS_REGEX = /^(?:[a-z0-9-]+\.)*[a-z0-9-]+\.eth$/;
export const SUBDOMAIN_REGEX = /^[a-z0-9-]+$/;
