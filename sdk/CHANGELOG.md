# Aragon OSx Commons SDK

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [UPCOMING]

### Added

- Add `PluginType` enum
- Add `resolveEnsName` functions
- Add `getProtocolVersion` function

### Removed

- SDK 1.0 related code that is not going to be used.

## v0.0.1

### Changed

- Replaces `tsdx` with `dts-cli`.
- Updates typescript verstion to `^5.1.0`.

### Added

- Added missing `ROOT_PERMISSION_ID` to the `PLUGIN_REPO_PERMISSIONS` constant.
- Created `SingleTargetPermission` type.
- Copied files from [aragon/sdk commit 76b4fc](https://github.com/aragon/sdk/tree/76b4fc815cfacce60b7c983ef0ce53110761f23a)

  - Classes `ClientCore`, `ContextCore`, `Context`, `GraphQLModule`, `Web3Module`, `IPFSModule`, `MultiUri`.
  - Error classes located in `errors.ts`.
  - Interfaces `IClientWeb3Core`, `IClientIpfsCore`, `IClientGraphQLCore`, `IClientCore`.
  - Functions `ensure0x`, `strip0x`, `hexToBytes`, `bytesToHex`, `encodeRatio`, `decodeRatio`, `encodeProposalId`, `decodeProposalId`, `boolArrayToBitmap`, `bitmapToBoolArray`, `getExtendedProposalId`, `getCompactProposalId`, `promiseWithTimeout`, `runAndRetry`, `resolveIpfsCid`, `isProposalId`, `isEnsName`, `isIpfsUri`, `isSubdomain`.
  - Constants `GraphqlNetworks`, `SupportedNetworksToGraphqlNetworks`, `UNSUPPORTED_PROPOSAL_METADATA_LINK`, `EMPTY_PROPOSAL_METADATA_LINK`, `UNAVAILABLE_PROPOSAL_METADATA`, `GRAPHQL_NODES`, `IPFS_ENDPOINTS`, `IPFS_NODES`, `LIVE_CONTRACTS`, `ADDITIONAL_NETWORKS`, `Permissions`, `PermissionIds`, `IPFS_CID_REGEX`, `IPFS_URI_REGEX`, `OSX_PROPOSAL_ID_REGEX`, `HEX_STRING_REGEX`, `ENS_REGEX`, `SUBDOMAIN_REGEX`.
  - Schemas `BigintSchema`, `AddressOrEnsSchema`, `AddressOrEnsWithoutAnySchema`, `VersionTagSchema`, `ApplyInstallationSchema`, `AbiSchema`, `ApplyUninstallationSchema`, `Uint8ArraySchema`, `IpfsUriSchema`, `SubdomainSchema`, `PaginationSchema`, `PrepareUninstallationSchema`, `MultiTargetPermissionSchema`, `PrepareInstallationSchema`, `PluginInstallItemSchema`.
  - Types in `types.ts`.

### Removed

- Removed event names since they are available through `osx-ethers`.
