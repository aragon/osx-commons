import {
  arbitrum,
  arbitrumSepolia,
  baseGoerli,
  baseMainnet,
  baseSepolia,
  getLatestNetworkDeployment,
  getNetworkDeploymentForVersion,
  getNetworkDeployments,
  goerli,
  mainnet,
  mumbai,
  polygon,
  sepolia,
} from '../../deployments';
import {SupportedNetworks, SupportedVersions} from '../../types';

describe('Deployments', () => {
  describe('getNetworkDeployments', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          network: SupportedNetworks.MAINNET,
          expected: mainnet,
        },
        {
          network: SupportedNetworks.GOERLI,
          expected: goerli,
        },
        {
          network: SupportedNetworks.SEPOLIA,
          expected: sepolia,
        },
        {
          network: SupportedNetworks.POLYGON,
          expected: polygon,
        },
        {
          network: SupportedNetworks.MUMBAI,
          expected: mumbai,
        },
        {
          network: SupportedNetworks.BASE,
          expected: baseMainnet,
        },

        {
          network: SupportedNetworks.BASE_GOERLI,
          expected: baseGoerli,
        },

        {
          network: SupportedNetworks.BASE_SEPOLIA,
          expected: baseSepolia,
        },

        {
          network: SupportedNetworks.ARBITRUM,
          expected: arbitrum,
        },

        {
          network: SupportedNetworks.ARBITRUM_SEPOLIA,
          expected: arbitrumSepolia,
        },
      ];
      inputs.map(({network, expected}) => {
        expect(getNetworkDeployments(network)).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkDeploymentForVersion', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          network: SupportedNetworks.MAINNET,
          version: SupportedVersions.V1_0_0,
          expected: mainnet[SupportedVersions.V1_0_0],
        },
        {
          network: SupportedNetworks.POLYGON,
          version: SupportedVersions.V1_3_0,
          expected: polygon[SupportedVersions.V1_3_0],
        },
        {
          network: SupportedNetworks.BASE,
          version: SupportedVersions.V1_3_0,
          expected: baseMainnet[SupportedVersions.V1_3_0],
        },
        {
          network: SupportedNetworks.BASE,
          version: SupportedVersions.V1_0_0,
          expected: null,
        },
      ];

      inputs.map(({network, version, expected}) => {
        if (expected === null) {
          expect(getNetworkDeploymentForVersion(network, version)).toBeNull();
          return;
        }
        expect(getNetworkDeploymentForVersion(network, version)).toMatchObject(
          expected
        );
      });
    });
  });
  describe('getLatestNetworkDeployment', () => {
    it('should return the correct value', () => {
      const inputs = [
        {
          network: SupportedNetworks.MAINNET,
          expected: mainnet[SupportedVersions.V1_3_0],
        },
        {
          network: SupportedNetworks.POLYGON,
          expected: polygon[SupportedVersions.V1_3_0],
        },
        {
          network: SupportedNetworks.BASE,
          expected: baseMainnet[SupportedVersions.V1_3_0],
        },
      ];

      inputs.map(({network, expected}) => {
        expect(getLatestNetworkDeployment(network)).toMatchObject(expected);
      });
    });
  });
});
