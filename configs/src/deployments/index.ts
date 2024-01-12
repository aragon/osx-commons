import {
  NetworkDeployment,
  NetworkDeploymnets,
  SupportedNetworks,
  SupportedVerions,
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

/**
 * Retrieves the network deployments based on the specified network.
 *
 * @param {SupportedNetworks} network - The network to retrieve the deployments for.
 * @return {NetworkDeployments} The network deployments for the specified network.
 */
export function getNetworkDeployments(
  network: SupportedNetworks
): NetworkDeploymnets {
  switch (network) {
    case SupportedNetworks.MAINNET:
      return mainnet;
    case SupportedNetworks.GOERLI:
      return goerli;
    case SupportedNetworks.SEPOLIA:
      return sepolia;
    case SupportedNetworks.POLYGON:
      return polygon;
    case SupportedNetworks.MUMBAI:
      return mumbai;
    case SupportedNetworks.BASE:
      return baseMainnet;
    case SupportedNetworks.BASE_GOERLI:
      return baseGoerli;
    case SupportedNetworks.BASE_SEPOLIA:
      return baseSepolia;
    case SupportedNetworks.ARBITRUM:
      return arbitrum;
    case SupportedNetworks.ARBITRUM_SEPOLIA:
      return arbitrumSepolia;
  }
}

/**
 * Retrieves the network deployment for a specific version.
 *
 * @param {SupportedNetworks} network - The network to retrieve the deployment for.
 * @param {SupportedVerions} version - The version of the deployment.
 * @return {NetworkDeployment | undefined} The network deployment for the specified version, or undefined if not found.
 */
export function getNetworkDeploymentForVersion(
  network: SupportedNetworks,
  version: SupportedVerions
): NetworkDeployment | undefined {
  return getNetworkDeployments(network)[version];
}

/**
 * Retrieves the latest network deployment for the specified network.
 *
 * @param {SupportedNetworks} network - The network to retrieve the deployment for.
 * @return {NetworkDeployment | undefined} The latest network deployment, or undefined if not found.
 */
export function getLatestNetworkDeployment(
  network: SupportedNetworks
): NetworkDeployment | undefined {
  const versions = Object.values(SupportedVerions).reverse();
  for (const version of versions) {
    const deployment = getNetworkDeploymentForVersion(network, version);
    if (deployment) {
      return deployment;
    }
  }
  return undefined;
}

export {
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
