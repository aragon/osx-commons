# Aragon JS SDK (client-common) changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this
project adheres to [Semantic Versioning](http://semver.org/).

<!--
TEMPLATE:
(Leave "## [UPCOMING]" first and describe the changes below it)

### Added
- Feature 1, 2, 3

### Changed
- Change 1, 2, 3

### Fixed
- Fix 1, 2, 3
-->

## [UPCOMING]

### Added

- Add new class error `InvalidPermissionOperationType`

## [1.7.1]

### Fixed

- ENS name Regex

## [1.7.0]

### Added

- Add common schemas for validations
- Support for sepolia network
- Move functionality from `sdk-common` to `sdk-client-common`
- New error classes `InvalidVersionError`, `PluginUpdatePreparationError` and `ProposalNotFoundError`
- Add `isSubdomain`, `isIpfsUri` and `isEnsName` functions
- Update SizeMismatchError error class

## 1.6.0

### Added

- Add generic prepare update function
- Add generic prepare update estimation function
- Support for multiple versions on `LIVE_CONTRACTS`

## 1.5.0-rc0

### Changed

- Renamed `LIVE_CONTRACTS` properties

### Added

- Support for local chains

## 1.4.0-rc0

### Added

- Support for baseMainnet network

## 1.3.0-rc0

### Added

- Support for baseGoerli network

## 1.2.1-rc0

### Fixed

- Default ipfs endpoints

## 1.2.0-rc0

### Added

- Tests for `getNamedTypesFromMetadata`

### Changed

- Updates `@aragon/osx-ethers` to v1.3.0-rc0.

## 1.1.0

- Added `MULTI_FETCH_TIMEOUT` for operations involving many remote data fetches

## 1.0.2

### Changed

- Fixed the ESM import path

## 1.0.1

### Added

- Add usage of common errors in all the code
- Export of OverridenState
