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
