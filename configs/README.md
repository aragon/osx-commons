# Aragon OSx Configs Commons

The `@aragon/osx-commons-configs` provides configurations and helpers for said
configurations necessary for the development of plugins and the OSx protocol.
This includes:

- Networks
  - if it is a testnet or not
  - chain ID
  - alias for ethers and Alchemy subgraph
- Deployments of the OSx protocol grouped by network
  - Version
  - Contract name
  - Contract address
  - Deployment transaction
  - Block number when the contract was deployed (which can differ from when the
    contract was activated and put in use)

The configuration doesn't provide the RPC URL by default, but you can set your preferred ones with the `addRpcUrlToNetwork` function.

## Installation

Use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install
@aragon/osx-commons-configs.

```bash
npm install @aragon/osx-commons-configs
yarn add @aragon/osx-commons-configs
```

## Testing

To execute library tests just run:

```bash
yarn test
```

## Security

If you believe you've found a security issue, we encourage you to notify us. We
welcome working with you to resolve the issue promptly.

Security Contact Email: sirt@aragon.org

Please do not use the issue tracker for security issues.
