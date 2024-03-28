# Aragon OSx Commons Subgraph

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.0.5

### Changed

- `getActionEntityId` now is composed of the caller, daoAddress, callId and the actionIndex.

## v0.0.4

### Fixed

- Fix `createWrappedERC20TokenCalls` params while calling `createERC20TokenCalls`.

## v0.0.3

### Changed

- Use generic functions for generating entity IDs, an unify the way of generating the composed ids.

## v0.0.2

### Fixes

- Add missing exports

## v0.0.1

### Changed

- Renamed `pluginRepo` to `plugin`

### Added

- Added `createTokenCalls`, `createERC20TokenCalls`, `createWrappedERC20TokenCalls`, `createERC1155TokenCalls` and `createERC721TokenCalls` mocks.
- Added `createDummyAction` function.
- Added `generateActionEntityId` and `generateStandardCAllbackEntityId`.
- Added `generateTransactionActionsProposalEntityId`, `generateProposalEntityId` and `generatePluginEntityId`.
- Added `generatePermissionId` and `generatePluginPermissionId`.
- Added `generatePluginRepoEntityId`, `generatePluginSetupEntityId`, `generatePluginInstallationEntityId`, `generatePluginPreparationEntityId`, `generatePluginReleaseEntityId`, and `generatePluginVersionEntityId`.
