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
import {NetworkConfigs, NetworkDeployment} from './types';

export * from './utils';
export * from './types';

const networksTyped: NetworkConfigs = networks;
const arbitrumTyped: NetworkDeployment = arbitrum;
const arbitrumSepoliaTyped: NetworkDeployment = arbitrumSepolia;
const baseGoerliTyped: NetworkDeployment = baseGoerli;
const baseMainnetTyped: NetworkDeployment = baseMainnet;
const baseSepoliaTyped: NetworkDeployment = baseSepolia;
const goerliTyped: NetworkDeployment = goerli;
const mainnetTyped: NetworkDeployment = mainnet;
const mumbaiTyped: NetworkDeployment = mumbai;
const polygonTyped: NetworkDeployment = polygon;
const sepoliaTyped: NetworkDeployment = sepolia;


const contracts = {
  mainnet: mainnetTyped,
  goerli: goerliTyped,
  sepolia: sepoliaTyped,
  polygon: polygonTyped,
  mumbai: mumbaiTyped,
  baseMainnet: baseMainnetTyped,
  baseGoerli: baseGoerliTyped,
  baseSepolia: baseSepoliaTyped,
  arbitrum: arbitrumTyped,
  arbitrumGoerli: arbitrumTyped,
  arbitrumSepolia: arbitrumSepoliaTyped,
};

export {
  contracts,
  networksTyped as networks,
  arbitrumTyped as arbitrum,
  arbitrumSepoliaTyped as arbitrumSepolia,
  baseGoerliTyped as baseGoerli,
  baseMainnetTyped as baseMainnet,
  baseSepoliaTyped as baseSepolia,
  goerliTyped as goerli,
  mainnetTyped as mainnet,
  mumbaiTyped as mumbai,
  polygonTyped as polygon,
  sepoliaTyped as sepolia,
};
