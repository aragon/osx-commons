# Aragon OSx Commons Contracts

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UPCOMING]

### Added

### Changed

- Use [OpenZepplin v4.9.6](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v4.9.6).
- Updated hardhat configuration to use the `commons-config` networks.

## v1.4.0

### Added

- Added an `address internal immutable IMPLEMENTATION` variable to `PluginSetup` and `PluginSetupUpgradeable` and its initialization through the respective constructors.

- Added an abstract `PluginUpgradeableSetup` base contract.

- Copied files from [aragon/osx commit e7ba46](https://github.com/aragon/osx/tree/e7ba46026db96931d3e4a585e8f30c585906e1fc)

  - interfaces `IDAO`, `IPermissionCondition`, `IPlugin`, `IMembership`, `IProposal`, `IPluginSetup`, `IProtocolVersion`,
  - abstract contracts `DaoAuthorizable`, `DaoAuthorizableUpgradeable`, `Plugin`, `PluginCloneable`, `PluginUUPSUpgradeable`, `PermissionCondition`, `PermissionConditionUpgradeable`, `Addresslist`, `Proposal`, `ProposalUpgradeable`, `PluginSetup`
  - contracts `CloneFactory`
  - libraries `PermissionLib`, `VersionComparisonLib`
  - free functions `auth`, `Proxy`, `BitMap`, `Ratio`, `UncheckedMath`

### Changed

- Replaced `Proxy` and `CloneFactory` by `ProxyLib` and `ProxyFactory`.
