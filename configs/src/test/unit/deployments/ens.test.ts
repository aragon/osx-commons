import {
  getDaoEnsDomain,
  getPluginEnsDomain,
  commonDomain,
  exceptionalDomains,
} from '../../../deployments';
import {SupportedNetworks} from '../../../networks';

describe('Domains', () => {
  describe('getDaoEnsDomain', () => {
    it('should return the correct dao ens', () => {
      for (const network of Object.values(SupportedNetworks)) {
        if (exceptionalDomains[network]) {
          expect(getDaoEnsDomain(network)).toMatch(
            exceptionalDomains[network]?.daoEns ?? ''
          );
        } else {
          expect(getDaoEnsDomain(network)).toMatch(commonDomain.daoEns);
        }
      }
    });
  });
  describe('getPluginEnsDomain', () => {
    it('should return the correct plugin ens', () => {
      for (const network of Object.values(SupportedNetworks)) {
        if (exceptionalDomains[network]) {
          expect(getPluginEnsDomain(network)).toMatch(
            exceptionalDomains[network]?.pluginEns ?? ''
          );
        } else {
          expect(getPluginEnsDomain(network)).toMatch(commonDomain.pluginEns);
        }
      }
    });
  });
  describe('add new network to exceptional domains', () => {
    beforeEach(() => {
      exceptionalDomains[SupportedNetworks.LOCAL] = {
        daoEns: 'new-dao.eth',
        pluginEns: 'plugin.new-dao.eth',
      };
    });
    it('should return the new exceptional dao ens', () => {
      expect(getDaoEnsDomain(SupportedNetworks.LOCAL)).toMatch(
        exceptionalDomains[SupportedNetworks.LOCAL]?.daoEns ?? ''
      );
    });
    it('should return the new exceptional plugin ens', () => {
      expect(getPluginEnsDomain(SupportedNetworks.LOCAL)).toMatch(
        exceptionalDomains[SupportedNetworks.LOCAL]?.pluginEns ?? ''
      );
    });
  });
});
