# Aragon OSx Commons Contracts

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v1.4.0

### Added

- Copied files from [aragon/osx commit e7ba46](https://github.com/aragon/osx/tree/e7ba46026db96931d3e4a585e8f30c585906e1fc)

  - interfaces `IDAO`, `IPermissionCondition`, `IPlugin`, `IMembership`, `IProposal`, `IPluginSetup`, `IProtocolVersion`,
  - abstract contracts `DaoAuthorizable`, `DaoAuthorizableUpgradeable`, `Plugin`, `PluginCloneable`, `PluginUUPSUpgradeable`, `PermissionCondition`, `PermissionConditionUpgradeable`, `Addresslist`, `Proposal`, `ProposalUpgradeable`, `PluginSetup`
  - contracts `CloneFactory`
  - libraries `PermissionLib`, `VersionComparisonLib`
  - free functions `auth`, `Proxy`, `BitMap`, `Ratio`, `UncheckedMath`
