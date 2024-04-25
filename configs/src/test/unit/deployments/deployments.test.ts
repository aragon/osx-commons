import {
  SupportedVersions,
  contracts,
  getLatestNetworkDeployment,
  getNetworkDeploymentForVersion,
  getNetworkDeployments,
} from '../../../deployments';
import {SupportedNetworks} from '../../../networks';

describe('Deployments', () => {
  describe('getNetworkDeployments', () => {
    it('should return the correct value', () => {
      const inputs = Object.values(SupportedNetworks).map(network => {
        return {
          network,
          expected: contracts[network],
        };
      });
      inputs.map(({network, expected}) => {
        expect(getNetworkDeployments(network)).toMatchObject(expected);
      });
    });
  });
  describe('getNetworkDeploymentForVersion', () => {
    it('should return the correct value', () => {
      const inputs = Object.values(SupportedNetworks).flatMap(network => {
        return Object.values(SupportedVersions).map(version => {
          return {
            network,
            version,
            expected: contracts[network][version] || null,
          };
        });
      });
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
      const inputs = Object.values(SupportedNetworks).map(network => {
        return {
          network,
          expected:
            contracts[network][SupportedVersions.V1_3_0] ||
            contracts[network][SupportedVersions.V1_0_0] ||
            null,
        };
      });

      inputs.map(({network, expected}) => {
        if (!expected) {
          expect(getLatestNetworkDeployment(network)).toBeNull();
          return;
        }
        expect(getLatestNetworkDeployment(network)).toMatchObject(expected);
      });
    });
  });
});
