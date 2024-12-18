# Aragon OSx Commons Contracts

## [UPCOMING]

## v1.4.0-alpha.6

### Added

- `Executor` contract, simple executor that loops through the actions and executes them.
- `RuledCondition` abstract contract that allows to create conditional permissions using rules.
- `currentTargetConfig` configuration to the `Plugin` it allows the plugins to execute through the Dao or the configured target.
- Included in the `IProposal` interface the functions `createProposal`, `hasSucceeded`, `execute`, `canExecute`, and `customProposalParamsABI`.
- `MetadataExtension` and `MetadataExtensionUpgradeable` abstract contracts that allows metadata setup at plugin level.

### Changed

- Use [OpenZepplin v4.9.6](https://github.com/OpenZeppelin/openzeppelin-contracts/releases/tag/v4.9.6).
- Updated hardhat configuration to use the `commons-config` networks.
- Proposals ids are no longer incremental with `proposalCount`, it will now be the resulting hash of proposal information and other important data.

### Deprecated

- `proposalCount` is deprecated, use instead`_createProposalId` function to get the proposal id.

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
