import {SupportedNetworks} from '../networks';
import {contracts} from './contracts';
import {exceptionalDomains, commonDomain} from './ens';
import {
  NetworkDeployment,
  NetworkDeployments,
  SupportedVersions,
} from './types';

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

export function getDaoEnsDomain(
  networkName: SupportedNetworks
): string | undefined {
  if (exceptionalDomains[networkName]) {
    return exceptionalDomains[networkName]?.daoEns;
  } else {
    return commonDomain.daoEns;
  }
}

export function getPluginEnsDomain(
  networkName: SupportedNetworks
): string | undefined {
  if (exceptionalDomains[networkName]) {
    return exceptionalDomains[networkName]?.pluginEns;
  } else {
    return commonDomain.pluginEns;
  }
}
