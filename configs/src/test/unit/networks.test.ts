import {
  NetworkConfig,
  SupportedAliases,
  SupportedNetworks,
} from '../../networks';
import {
  getNetwork,
  getNetworkAlias,
  getNetworkByAlias,
  getNetworkByChainId,
  getNetworkByNameOrAlias,
  getNetworkNameByAlias,
} from '../../networks/getters';
import {
  networks,
  networksAlchemyRpcUrl,
  addRpcUrlToNetwork,
} from '../../networks/networks';

describe('Deployments', () => {
  describe('getNetwork', () => {
    it('should return the correct value', () => {
      const inputs: {
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
    it('should return a network given a name', () => {
      const inputs = Object.values(SupportedNetworks).map(network => {
        return {
          network,
          expected: networks[network],
        };
      });
      inputs.map(({network, expected}) => {
        expect(getNetworkByNameOrAlias(network)).toMatchObject(expected);
      });
    });
    it('should return a network given an alias', () => {
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
        expect(getNetworkByNameOrAlias(network as string)).toMatchObject(
          expected
        );
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
      const inputs = Object.values(SupportedNetworks)
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
      const inputs = Object.values(SupportedNetworks).flatMap(nw => {
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
  describe('getNetworkByChainId', () => {
    it('should get the network given the chainId', () => {
      const inputs = Object.values(SupportedNetworks).map(network => {
        return {
          network:
            network === SupportedNetworks.DEV_SEPOLIA
              ? 0
              : networks[network].chainId,
          expected: networks[network],
        };
      });
      inputs.map(({network, expected}) => {
        expect(getNetworkByChainId(network)).toBe(expected);
      });
    });
  });
  describe('addRpcUrlToNetwork', () => {
    it('should add the rpc url to the networks', () => {
      const apiKey: string = 'TEST_API_KEY';
      addRpcUrlToNetwork(apiKey, networksAlchemyRpcUrl);
      Object.values(SupportedNetworks).map(network => {
        if (network === SupportedNetworks.LOCAL) {
          expect(networks[network].url).toBe(
            networksAlchemyRpcUrl[SupportedNetworks.LOCAL]
          );
        } else if (network === SupportedNetworks.BASE_GOERLI) {
          expect(networks[network].url).toBe(
            networksAlchemyRpcUrl[SupportedNetworks.BASE_GOERLI]
          );
        } else {
          expect(networks[network].url).toBe(
            `${networksAlchemyRpcUrl[network]}${apiKey}`
          );
        }
      });
    });
  });
});
