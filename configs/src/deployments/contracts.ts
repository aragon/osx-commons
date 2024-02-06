import {SupportedNetworks} from '../networks';
import * as arbitrum from './deployments/arbitrum.json';
import * as arbitrumSepolia from './deployments/arbitrumSepolia.json';
import * as baseGoerli from './deployments/baseGoerli.json';
import * as baseMainnet from './deployments/baseMainnet.json';
import * as baseSepolia from './deployments/baseSepolia.json';
import * as goerli from './deployments/goerli.json';
import * as mainnet from './deployments/mainnet.json';
import * as mumbai from './deployments/mumbai.json';
import * as polygon from './deployments/polygon.json';
import * as sepolia from './deployments/sepolia.json';
import {NetworkDeployment, SupportedVersions} from './types';

export {
  mainnet,
  goerli,
  sepolia,
  polygon,
  mumbai,
  baseMainnet,
  baseGoerli,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
};

export const contracts: {
  [network in SupportedNetworks]: {
    [version in SupportedVersions]?: NetworkDeployment;
  };
} = {
  mainnet,
  goerli,
  sepolia,
  polygon,
  mumbai,
  baseMainnet,
  baseGoerli,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  local: {
    [SupportedVersions.V1_0_0]: {} as NetworkDeployment,
    [SupportedVersions.V1_3_0]: {} as NetworkDeployment,
  },
};
