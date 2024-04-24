# osx-commons

OSX-Commons: A collection of shared resources and utilities for the Aragon OSX DAO Framework, including contracts, subgraph, and SDK functionalities.

## Project

The root folder of the repo includes four subfolders:

```markdown
.
├── configs
├── contracts
├── sdk
├── subgraph
├── ...
└── package.json
```

- The `configs` folder contains general configurations such as the contract addresses for each network that Aragon OSx
  has been officially deployed to, which are importable in JS/TS code.
- The `contracts` folder contains Solidity smart contracts being used by the OSx framework and for plugin development.
- The `sdk` folder contains various JS/TS helper functions that can be used in the OSx repo and plugin repos for
  for testing and deployment.
- The `subgraph` contains various JS/TS helper functions that can be used in the OSx repo and plugin repos for
  for subgraph development.

The root-level `package.json` file contains global `dev-dependencies` for formatting and linting. After installing the dependencies with

```sh
yarn install
```

you can run the associated [formatting](#formatting) and [linting](#linting) commands.

### Formatting

```sh
yarn prettier:check
```

all `.sol`, `.js`, `.ts`, `.json`, and `.yml` files will be format-checked according to the specifications in `.prettierrc` file. With

```sh
yarn prettier:write
```

the formatting is applied.

### Linting

With

```sh
yarn lint
```

`.sol`, `.js`, and `.ts` files in the subfolders are analyzed with `solhint` and `eslint`, respectively.

### Setting Environment Variables

To be able to work on the contracts, make sure that you have created an `.env` file from the `.env.example` file and put in the API keys for

- [Alchemy](https://www.alchemy.com) that we use as the web3 provider
- [Alchemy Subgraphs](https://www.alchemy.com/subgraphs) that we use as the subgraph provider
- the block explorer that you want to use depending on the networks that you want to deploy to

You can also change the default hardhat private key (`PRIVATE_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"`).
Note however, that the contracts in this repo are not meant to be deployed directly.

## Audits

Our smart contracts undergo regular audits.

### v1.0.0

_Version `1.0.0` of `osx-commons-contracts` has been audit when it was part of the `aragon/osx` repo._

**Halborn**: [link 1](./audits/Halborn_AragonOSx_2023-02-24.pdf), [link 2](https://github.com/HalbornSecurity/PublicReports/blob/b3fe424535dce7ce345f74dc7e6c25e9200e7860/Solidity%20Smart%20Contract%20Audits/Aragon_aragonOS_Smart_Contract_Security_Audit_Report_Halborn_Final.pdf)

- Commit ID: [cb0621dc5185a73240a6ca33fccc7698f059fdf5](https://github.com/aragon/osx/commit/cb0621dc5185a73240a6ca33fccc7698f059fdf5)
- Started: 2023-02-07
- Finished: 2023-02-24

### v1.3.0

_Version `1.3.0` of `osx-commons-contracts` has been audit when it was part of the `aragon/osx` repo._

**Code4rena**: [link 1](./audits/Code4rena_AragonOSx_2023-12-12.pdf), [link 2](https://code4rena.com/reports/2023-03-aragon)

- Commit ID: [a2461ae61a8c4cc833a117120b76e306936f5e1c](https://github.com/aragon/osx/commit/a2461ae61a8c4cc833a117120b76e306936f5e1c)
- Started: 2023-03-03
- Finished: 2023-03-10

**Halborn**: [link 1](./audits/Halborn_AragonOSx_2023-06-13.pdf), [link 2](https://github.com/HalbornSecurity/PublicReports/blob/b3fe424535dce7ce345f74dc7e6c25e9200e7860/Solidity%20Smart%20Contract%20Audits/Aragon_aragonOS_v1_3_0_Smart_Contract_Security_Assessment_Report_Halborn_Final.pdf)

- Commit ID: [0ad8cad2bb661fbd53086d097d11228304d9b73e](https://github.com/aragon/osx/commit/0ad8cad2bb661fbd53086d097d11228304d9b73e)
- Started: 2023-05-29
- Finished: 2023-06-13

## Contributing

If you like what we're doing and would love to support, please review our `CONTRIBUTING_GUIDE.md` [here](https://github.com/aragon/osx/blob/develop/CONTRIBUTION_GUIDE.md). We'd love to build with you.

## Security

If you believe you've found a security issue, we encourage you to notify us. We welcome working with you to resolve the issue promptly.

Security Contact Email: sirt@aragon.org

Please do not use the issue tracker for security issues.
