import {
  getNetwork,
  getNetworkAlias,
  getNetworkByAlias,
  getNetworkByNameOrAlias,
  getNetworkNameByAlias,
  networks,
} from '../../networks';
import {SupportedAliases, SupportedNetworks} from '../../types';

describe('Deployments', () => {
  describe('getNetwork', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          network: SupportedNetworks.MAINNET,
          expected: networks.mainnet,
        },
        {
          network: SupportedNetworks.POLYGON,
          expected: networks.polygon,
        },
        {
          network: SupportedNetworks.BASE,
          expected: networks.baseMainnet,
        },
        {
          network: '' as SupportedNetworks,
          expected: null,
        },
      ];

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
      const inputs = [
        {
          network: SupportedNetworks.MAINNET,
          expected: networks.mainnet,
        },
        {
          network: 'homestead',
          expected: networks.mainnet,
        },
        {
          network: 'maticmum',
          expected: networks.mumbai,
        },
        {
          network: 'matic',
          expected: networks.polygon,
        },
        {
          network: 'otherNetwork',
          expected: null,
        },
      ];

      inputs.map(({network, expected}) => {
        if (!expected) {
          expect(getNetworkByNameOrAlias(network)).toBeNull();
          return;
        }
        expect(getNetworkByNameOrAlias(network)).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkByAlias', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          network: 'homestead',
          expected: networks.mainnet,
        },
        {
          network: 'maticmum',
          expected: networks.mumbai,
        },
        {
          network: 'matic',
          expected: networks.polygon,
        },
        {
          network: 'otherNetwork',
          expected: null,
        },
      ];

      inputs.map(({network, expected}) => {
        if (!expected) {
          expect(getNetworkByAlias(network)).toBeNull();
          return;
        }
        expect(getNetworkByAlias(network)).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkNameByAlias', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          network: 'homestead',
          expected: SupportedNetworks.MAINNET,
        },
        {
          network: 'maticmum',
          expected: SupportedNetworks.MUMBAI,
        },
        {
          network: 'matic',
          expected: SupportedNetworks.POLYGON,
        },
        {
          network: 'otherNetwork',
          expected: null,
        },
      ];

      inputs.map(({network, expected}) => {
        expect(getNetworkNameByAlias(network)).toBe(expected);
      });
    });
  });
  describe('getNetworkAlias', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          aliasName: SupportedAliases.ETHERS5,
          network: SupportedNetworks.MAINNET,
          expected: 'homestead',
        },
        {
          aliasName: SupportedAliases.ETHERS6,
          network: SupportedNetworks.POLYGON,
          expected: 'matic',
        },
        {
          aliasName: SupportedAliases.ALCHEMY_SUBGRAPHS,
          network: SupportedNetworks.POLYGON,
          expected: 'matic',
        },
        {
          aliasName: SupportedAliases.ETHERS5,
          network: SupportedNetworks.BASE,
          expected: SupportedNetworks.BASE,
        },
        {
          aliasName: SupportedAliases.ETHERS5,
          network: 'otherNetwork' as SupportedNetworks,
          expected: null,
        },
      ];
      inputs.map(({aliasName, network, expected}) => {
        expect(getNetworkAlias(aliasName, network)).toBe(expected);
      });
    });
  });
});
