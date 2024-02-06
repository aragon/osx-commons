import {
  NetworkDeployment,
  NetworkDeployments,
  SupportedNetworks,
  SupportedVersions,
} from '../types';
import * as arbitrum from './arbitrum.json';
import * as arbitrumSepolia from './arbitrumSepolia.json';
import * as baseGoerli from './baseGoerli.json';
import * as baseMainnet from './baseMainnet.json';
import * as baseSepolia from './baseSepolia.json';
import * as goerli from './goerli.json';
import * as mainnet from './mainnet.json';
import * as mumbai from './mumbai.json';
import * as polygon from './polygon.json';
import * as sepolia from './sepolia.json';

const contracts: {
  [network in SupportedNetworks]: {
    [version in SupportedVersions]?: NetworkDeployment;
  };
} = {
  mainnet,
  goerli,
  sepolia,
  polygon,
  mumbai,
  baseMainnet,
  baseGoerli,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  local: {
    [SupportedVersions.V1_0_0]: {} as NetworkDeployment,
    [SupportedVersions.V1_3_0]: {} as NetworkDeployment,
  },
};

/**
 * Retrieves the network deployments based on the specified network.
 *
 * @param {SupportedNetworks} network - The network to retrieve the deployments for.
 * @return {NetworkDeployments} The network deployments for the specified network.
 */
export function getNetworkDeployments(
  network: SupportedNetworks
): NetworkDeployments {
  return contracts[network];
}

/**
 * Retrieves the network deployment for a specific version.
 *
 * @param {SupportedNetworks} network - The network to retrieve the deployment for.
 * @param {SupportedVersions} version - The version of the deployment.
 * @return {NetworkDeployment | null} The network deployment for the specified version, or null if not found.
 */
export function getNetworkDeploymentForVersion(
  network: SupportedNetworks,
  version: SupportedVersions
): NetworkDeployment | null {
  return getNetworkDeployments(network)[version] || null;
}

/**
 * Retrieves the latest network deployment for the specified network.
 *
 * @param {SupportedNetworks} network - The network to retrieve the deployment for.
 * @return {NetworkDeployment | null} The latest network deployment, or null if not found.
 */
export function getLatestNetworkDeployment(
  network: SupportedNetworks
): NetworkDeployment | null {
  const versions = Object.values(SupportedVersions).reverse();
  for (const version of versions) {
    const deployment = getNetworkDeploymentForVersion(network, version);
    if (deployment) {
      return deployment;
    }
  }
  return null;
}

export {
  contracts,
  mainnet,
  goerli,
  sepolia,
  polygon,
  mumbai,
  baseMainnet,
  baseGoerli,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
};
