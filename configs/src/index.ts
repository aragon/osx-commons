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
import * as networks from './networks.json';
import {NetworkConfigs} from './types';

export * from './types';

const networksTyped: NetworkConfigs = networks;

export {
  networksTyped as networks,
  arbitrum,
  arbitrumSepolia,
  baseGoerli,
  baseMainnet,
  baseSepolia,
  goerli,
  mainnet,
  mumbai,
  polygon,
  sepolia,
};
