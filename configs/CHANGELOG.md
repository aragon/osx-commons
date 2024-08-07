# Aragon OSx Commons Configs

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.7.0-alpha.1

## Added

- Add `devSepolia` network configuration. Test deployment on sepolia/

## v0.7.0

## Added

- Add `holesky` network configuration.

## Removed

- Remove `ENSRegistry` address from `Sepolia` deploymnet.

## v0.6.0

## Added

- Add `zksync-mainnet` network configuration.

## v0.5.0

## Added

- Add `zksync-sepolia` network configuration.

## v0.4.0

### Added

- Add `addRpcUrlToNetwork` function to set the network RPC url, the function will receive the API_KEY and the RPCs URL for the SupportedNetworks.

### Removed

- Removed the RPC URL from the networks configuration.

## v0.3.0

### Added

- `getDaoEnsDomain` and `getPluginEnsDomain` functions.

## v0.2.0

### Added

- `getNetworkByChainId` function
- Support for local networks

### Changed

- All undefined return values to `null` instead of `undefined`

## v0.1.0

### Added

- Types for Deployments
- `SupportedNetworks` enum
- `SupportedAliases` enum
- `SupportedVersions` enum
- Typed deployments
- `contracts` object with all contracts
- `getNetworkAlias` function
- `getNetworkNameFromAlias` function
- `getNetworkDeployments` function
- `getNetworkDeploymentForVersion` function
- `getLatestNetworkDeployment` function
- `getNetwork` function
- `getNetworkByNameOrAlias` function
- `getNetworkByAlias` function
- `getNetworkNameByAlias` function
- `getNetworkAlias` function

## v0.0.2

### Added

- Deployment JSON files for:
  - Mainnet
  - Goerli
  - Sepolia
  - Polygon
  - Mumbai
  - Base Mainnet
  - Base Goerli
  - Base Sepolia
  - Arbitrum
  - Arbitrum Sepolia
- JSON file with the supported networks and the default rpcs, chainIds, and aliases on other services.
- Typing for the Network Configs.
