import {SupportedNetworks} from '../networks';
import {NetworkDomains, NetworkDomain} from './types';

export const commonDomain: NetworkDomain = {
  daoEns: 'dao.eth',
  pluginEns: 'plugin.dao.eth',
};

export const exceptionalDomains: NetworkDomains = {
  [SupportedNetworks.SEPOLIA]: {
    daoEns: 'aragon-dao.eth',
    pluginEns: 'plugin.aragon-dao.eth',
  },
};

export function getDaoEnsDomain(networkName: string): string {
  if (exceptionalDomains[networkName]) {
    return exceptionalDomains[networkName].daoEns;
  } else {
    return commonDomain.daoEns;
  }
}

export function getPluginEnsDomain(networkName: string): string {
  if (exceptionalDomains[networkName]) {
    return exceptionalDomains[networkName].pluginEns;
  } else {
    return commonDomain.pluginEns;
  }
}
