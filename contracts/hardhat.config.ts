import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-etherscan';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import {config as dotenvConfig} from 'dotenv';
import {ethers} from 'ethers';
import 'hardhat-deploy';
import 'hardhat-gas-reporter';
import {extendEnvironment, HardhatUserConfig} from 'hardhat/config';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import type {NetworkUserConfig} from 'hardhat/types';
import {resolve} from 'path';
import 'solidity-coverage';
import 'solidity-docgen';

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || '../.env';
dotenvConfig({path: resolve(__dirname, dotenvConfigPath)});

if (!process.env.INFURA_API_KEY) {
  throw new Error('INFURA_API_KEY in .env not set');
}

const apiUrls: {[index: string]: string} = {
  mainnet: 'https://mainnet.infura.io/v3/',
  goerli: 'https://goerli.infura.io/v3/',
  sepolia: 'https://sepolia.infura.io/v3/',
  polygon: 'https://polygon-mainnet.infura.io/v3/',
  polygonMumbai: 'https://polygon-mumbai.infura.io/v3/',
  base: 'https://mainnet.base.org',
  baseGoerli: 'https://goerli.base.org',
  arbitrum: 'https://arbitrum-mainnet.infura.io/v3/',
  arbitrumGoerli: 'https://arbitrum-goerli.infura.io/v3/',
};

export const networks: {[index: string]: NetworkUserConfig} = {
  hardhat: {
    chainId: 31337,
    forking: {
      url: `${
        apiUrls[process.env.NETWORK_NAME ? process.env.NETWORK_NAME : 'mainnet']
      }${process.env.INFURA_API_KEY}`,
    },
  },
  mainnet: {
    chainId: 1,
    url: `${apiUrls.mainnet}${process.env.INFURA_API_KEY}`,
  },
  goerli: {
    chainId: 5,
    url: `${apiUrls.goerli}${process.env.INFURA_API_KEY}`,
  },
  sepolia: {
    chainId: 11155111,
    url: `${apiUrls.sepolia}${process.env.INFURA_API_KEY}`,
  },
  polygon: {
    chainId: 137,
    url: `${apiUrls.polygon}${process.env.INFURA_API_KEY}`,
  },
  polygonMumbai: {
    chainId: 80001,
    url: `${apiUrls.polygonMumbai}${process.env.INFURA_API_KEY}`,
  },
  base: {
    chainId: 8453,
    url: `${apiUrls.base}`,
    gasPrice: ethers.utils.parseUnits('0.001', 'gwei').toNumber(),
  },
  baseGoerli: {
    chainId: 84531,
    url: `${apiUrls.baseGoerli}`,
    gasPrice: ethers.utils.parseUnits('0.0000001', 'gwei').toNumber(),
  },
  arbitrum: {
    chainId: 42161,
    url: `${apiUrls.arbitrum}${process.env.INFURA_API_KEY}`,
  },
  arbitrumGoerli: {
    chainId: 421613,
    url: `${apiUrls.arbitrumGoerli}${process.env.INFURA_API_KEY}`,
  },
};

// Uses hardhats private key if none is set. DON'T USE THIS ACCOUNT FOR DEPLOYMENTS
const accounts = process.env.PRIVATE_KEY
  ? process.env.PRIVATE_KEY.split(',')
  : ['0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'];

for (const network in networks) {
  // special treatement for hardhat
  if (network.startsWith('hardhat')) {
    networks[network].accounts = {
      mnemonic: 'test test test test test test test test test test test junk',
    };
    continue;
  }
  networks[network].accounts = accounts;
}

// Extend HardhatRuntimeEnvironment
extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  hre.aragonToVerifyContracts = [];
});

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || '',
      goerli: process.env.ETHERSCAN_API_KEY || '',
      sepolia: process.env.ETHERSCAN_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      base: process.env.BASESCAN_API_KEY || '',
      baseGoerli: process.env.BASESCAN_API_KEY || '',
      arbitrumOne: process.env.ARBISCAN_API_KEY || '',
      arbitrumGoerli: process.env.ARBISCAN_API_KEY || '',
    },
    customChains: [
      {
        network: 'sepolia',
        chainId: 11155111,
        urls: {
          apiURL: 'https://api-sepolia.etherscan.io/api',
          browserURL: 'https://sepolia.etherscan.io',
        },
      },
      {
        network: 'base',
        chainId: 8453,
        urls: {
          apiURL: 'https://api.basescan.org/api',
          browserURL: 'https://basescan.org',
        },
      },
      {
        network: 'baseGoerli',
        chainId: 84531,
        urls: {
          apiURL: 'https://api-goerli.basescan.org/api',
          browserURL: 'https://goerli.basescan.org',
        },
      },
    ],
  },

  namedAccounts: {
    deployer: 0,
    alice: 0,
    bob: 1,
    carol: 2,
    dave: 3,
    eve: 4,
    frank: 5,
    grace: 6,
    harold: 7,
    ivan: 8,
    judy: 9,
    mallory: 10,
  },

  gasReporter: {
    currency: 'USD',
    enabled: process.env.REPORT_GAS === 'true' ? true : false,
    excludeContracts: [],
    src: './contracts',
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  },

  networks,
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './src',
    tests: './test',
    deploy: './deploy',
  },

  solidity: {
    version: '0.8.17',
    settings: {
      metadata: {
        // Not including the metadata hash
        // https://github.com/paulrberg/hardhat-template/issues/31
        bytecodeHash: 'none',
      },
      // Disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
  typechain: {
    outDir: 'typechain',
    target: 'ethers-v5',
  },
  docgen: {
    outputDir: 'docs/developer-portal/reference-guide',
    theme: 'markdown',
    pages: 'files',
    templates: 'docs/templates',
    collapseNewlines: true,
    exclude: ['test'],
  },
};

export default config;
