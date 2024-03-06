import {SupportedNetworks} from '../networks';
import {ENSNetworkDomain, ENSNetworkDomainsMap} from './types';

export const commonDomain: ENSNetworkDomain = {
  daoEns: 'dao.eth',
  pluginEns: 'plugin.dao.eth',
};

export const exceptionalDomains: ENSNetworkDomainsMap = {
  [SupportedNetworks.SEPOLIA]: {
    daoEns: 'aragon-dao.eth',
    pluginEns: 'plugin.aragon-dao.eth',
  },
};
