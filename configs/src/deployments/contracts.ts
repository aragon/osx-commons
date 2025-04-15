import {SupportedNetworks} from '../networks';
import * as agungTestnet from './json/agungTestnet.json';
import * as arbitrum from './json/arbitrum.json';
import * as arbitrumSepolia from './json/arbitrumSepolia.json';
import * as baseGoerli from './json/baseGoerli.json';
import * as baseMainnet from './json/baseMainnet.json';
import * as baseSepolia from './json/baseSepolia.json';
import * as bscMainnet from './json/bscMainnet.json';
import * as bscTestnet from './json/bscTestnet.json';
import * as celo from './json/celo.json';
import * as corn from './json/corn.json';
import * as devSepolia from './json/devSepolia.json';
import * as goerli from './json/goerli.json';
import * as holesky from './json/holesky.json';
import * as linea from './json/linea.json';
import * as lineaSepolia from './json/lineaSepolia.json';
import * as mainnet from './json/mainnet.json';
import * as modeMainnet from './json/modeMainnet.json';
import * as monadTestnet from './json/monadTestnet.json';
import * as mumbai from './json/mumbai.json';
import * as peaq from './json/peaq.json';
import * as polygon from './json/polygon.json';
import * as sepolia from './json/sepolia.json';
import * as unichain from './json/unichain.json';
import * as zksyncMainnet from './json/zksyncMainnet.json';
import * as zksyncSepolia from './json/zksyncSepolia.json';
import {NetworkDeployment, SupportedVersions} from './types';

export {
  mainnet,
  goerli,
  sepolia,
  holesky,
  polygon,
  mumbai,
  baseMainnet,
  baseGoerli,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  zksyncSepolia,
  zksyncMainnet,
  devSepolia,
  linea,
  lineaSepolia,
  peaq,
  agungTestnet,
  modeMainnet,
  bscMainnet,
  bscTestnet,
  monadTestnet,
  unichain,
  corn,
  celo,
};

export const contracts: {
  [network in SupportedNetworks]: {
    [version in SupportedVersions]?: NetworkDeployment;
  };
} = {
  mainnet,
  goerli,
  sepolia,
  holesky,
  polygon,
  mumbai,
  baseMainnet,
  baseGoerli,
  baseSepolia,
  arbitrum,
  arbitrumSepolia,
  zksyncSepolia,
  zksyncMainnet,
  devSepolia,
  linea,
  lineaSepolia,
  peaq,
  agungTestnet,
  modeMainnet,
  bscMainnet,
  bscTestnet,
  monadTestnet,
  unichain,
  corn,
  celo,
  local: {
    [SupportedVersions.V1_0_0]: {} as NetworkDeployment,
    [SupportedVersions.V1_3_0]: {} as NetworkDeployment,
  },
};
