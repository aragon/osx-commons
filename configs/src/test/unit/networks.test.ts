import {
  getNetwork,
  getNetworkAlias,
  getNetworkByAlias,
  getNetworkByNameOrAlias,
  getNetworkNameByAlias,
  networks,
} from '../../networks';
import {NetworkConfig, SupportedAliases, SupportedNetworks} from '../../types';

describe('Deployments', () => {
  describe('getNetwork', () => {
    it('should return the correct value', () => {
      let inputs: {
        network: SupportedNetworks;
        expected: NetworkConfig | null;
      }[] = Object.values(SupportedNetworks).map(network => {
        return {
          network,
          expected: networks[network],
        };
      });

      inputs.push({
        network: 'otherNetwork' as SupportedNetworks,
        expected: null,
      });

      inputs.map(({network, expected}) => {
        if (!expected) {
          expect(getNetwork(network)).toBeNull();
          return;
        }
        expect(getNetwork(network)).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkByNameOrAlias', () => {
    it('should return the correct value', () => {
      let inputs = Object.values(SupportedNetworks)
        .flatMap(nw => {
          return Object.values(SupportedAliases).map(alias => {
            return {
              network: networks[nw].aliases[alias],
              expected: networks[nw],
            };
          });
        })
        .filter(({network}) => network !== undefined);

      inputs = inputs.concat(
        Object.values(SupportedNetworks).map(network => {
          return {
            network,
            expected: networks[network],
          };
        })
      );

      inputs.map(({network, expected}) => {
        if (!expected) {
          expect(getNetworkByNameOrAlias(network as string)).toBeNull();
          return;
        }
        const res = getNetworkByNameOrAlias(network as string);
        expect(res).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkByAlias', () => {
    it('should return the correct value', () => {
      const inputs = Object.values(SupportedNetworks)
        .flatMap(nw => {
          return Object.values(SupportedAliases).map(alias => {
            return {
              network: networks[nw].aliases[alias],
              expected: networks[nw],
            };
          });
        })
        .filter(({network}) => network !== undefined);

      inputs.map(({network, expected}) => {
        if (!expected) {
          expect(getNetworkByAlias(network as string)).toBeNull();
          return;
        }
        expect(getNetworkByAlias(network as string)).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkNameByAlias', () => {
    it('should return the correct value', () => {
      let inputs = Object.values(SupportedNetworks)
        .flatMap(nw => {
          return Object.values(SupportedAliases).map(alias => {
            return {
              network: networks[nw].aliases[alias],
              expected: nw,
            };
          });
        })
        .filter(({network}) => network !== undefined);

      inputs.map(({network, expected}) => {
        expect(getNetworkNameByAlias(network as string)).toBe(expected);
      });
    });
  });
  describe('getNetworkAlias', () => {
    it('should return the correct value', () => {
      let inputs = Object.values(SupportedNetworks).flatMap(nw => {
        return Object.values(SupportedAliases).map(alias => {
          return {
            aliasName: alias,
            network: nw,
            expected: networks[nw].aliases[alias] || nw,
          };
        });
      });
      inputs.map(({aliasName, network, expected}) => {
        expect(getNetworkAlias(aliasName, network)).toBe(expected);
      });
    });
  });
});
