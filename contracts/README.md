# Aragon OSx Commons Contracts

This package contains the Solidity smart contracts to be used by the OSx framework and for plugin development.
For audit information, refer to the ['Audits' section in the root level README.md](../README.md#audits).

## Project

The `contracts` folder includes the following Solidity contracts and libraries:

```markdown
.
├── dao
│ └── IDAO.sol
├── permission
│ ├── PermissionLib.sol
│ ├── auth
│ │ ├── DaoAuthorizable.sol
│ │ ├── DaoAuthorizableUpgradeable.sol
│ │ └── auth.sol
│ └── condition
│ ├── IPermissionCondition.sol
│ ├── PermissionCondition.sol
│ └── PermissionConditionUpgradeable.sol
├── plugin
│ ├── IPlugin.sol
│ ├── Plugin.sol
│ ├── PluginCloneable.sol
│ ├── PluginUUPSUpgradeable.sol
│ ├── extensions
│ │ ├── governance
│ │ │ └── Addresslist.sol
│ │ ├── membership
│ │ │ └── IMembership.sol
│ │ └── proposal
│ │ ├── IProposal.sol
│ │ ├── Proposal.sol
│ │ └── ProposalUpgradeable.sol
│ └── setup
│ ├── IPluginSetup.sol
│ ├── PluginSetup.sol
│ └── PluginUpgradeableSetup.sol
└── utils
├── deployment
│ ├── ProxyFactory.sol
│ └── ProxyLib.sol
├── math
│ ├── BitMap.sol
│ ├── Ratio.sol
│ └── UncheckedMath.sol
└── versioning
├── IProtocolVersion.sol
├── ProtocolVersion.sol
└── VersionComparisonLib.sol
```

For **plugin development**, find the plugin base classes provided in the `plugin` folder and proxy deployment helpers in the `utils/deployment` folder.

In `contracts`, first run

```sh
yarn install
```

### Building

First build the contracts with

```sh
yarn build
```

This will also generate the typechain bindings. During development of your smart contracts, changes can result
in altered typechain bindings. You can remove the outdated build- and typechain-related files with

```sh
yarn clean
```

which will execute `yarn typechain` again. For convenience, use `yarn clean && yarn build`.

### Testing

To test your contracts, run

```sh
yarn test
```

### Linting

Lint the Solidity and TypeScript code all together with

```sh
yarn lint
```

or separately with

```sh
yarn lint:sol
```

and

```sh
yarn lint:ts
```

### Coverage

Generate the code coverage report with

```sh
yarn coverage
```

### Gas Report

See the gas usage per test and average gas per method call with

```sh
REPORT_GAS=true yarn test
```

you can permanently enable the gas reporting by putting the `REPORT_GAS=true` into the `.env` file.
