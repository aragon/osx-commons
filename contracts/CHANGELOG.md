# Aragon OSx Commons Contracts

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.0.1-alpha.0

### Added

- Copied files from [aragon/osx commit e7ba46](https://github.com/aragon/osx/tree/e7ba46026db96931d3e4a585e8f30c585906e1fc)

  - interfaces `IMajorityVoting`, `IMembership`, `IProposal`, `IERC20MintableUpgradeable`, `IGovernanceWrappedERC20`
  - abstract contracts `MajorityVotingBase`, `Addresslist`,`Proposal`, `ProposalUpgradeable`, `GovernanceERC20`, `GovernanceWrappedERC20`,
  - contracts `PlaceholderSetup`,
  - libraries `VersionComparisonLib`
  - free functions `BitMap`, `Ratio`, and `UncheckedMath`
  - test helpers `TestERC1155`, `TestERC20`, `TestERC721`, `TestGovernanceERC20`, `AddresslistMock`, `MajorityVotingMock`, `RatioTest`, `VersionComparisonLibTest`
