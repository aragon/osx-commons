import {
  baseMainnet,
  getLatestNetworkDeployment,
  getNetworkDeploymentForVersion,
  getNetworkDeployments,
  mainnet,
  polygon,
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
          network: SupportedNetworks.POLYGON,
          expected: polygon,
        },
        {
          network: SupportedNetworks.BASE,
          expected: baseMainnet,
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
          expected: undefined,
        },
      ];

      inputs.map(({network, version, expected}) => {
        if (!expected) {
          expect(
            getNetworkDeploymentForVersion(network, version)
          ).toBeUndefined();
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
