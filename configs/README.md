# Aragon OSx Configs Commons

The `@aragon/osx-commons-configs` provides configurations and helpers for said
configurations necessary for the development of plugins and the OSx protocol.
This includes:

- Networks
  - if it is a testnet or not
  - chain ID
  - alias for ethers
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

## Development

The list of contract artifacts on `src/deployments/json` **is deprecated** and will be removed in the future.

Instead, use the appropriate artifacts package for each component:

- https://www.npmjs.com/package/@aragon/osx-artifacts
- https://www.npmjs.com/package/@aragon/admin-plugin-artifacts
- https://www.npmjs.com/package/@aragon/multisig-plugin-artifacts
- https://www.npmjs.com/package/@aragon/token-voting-plugin-artifacts
- https://www.npmjs.com/package/@aragon/staged-proposal-processor-plugin-artifacts

### Generating the JSON files

To generate the `src/deployments/json/<network>.json` files, use the provided `sync-factory-addresses.ts` script like so:

```sh
# Define your parameters
export RPC_URL="https://server/api"
SRC_PROTOCOL_ADDRESSES=".../protocol-factory/artifacts/addresses-<network>-<timestamp>.json"
SRC_DEPLOYMENT_RUN_FILE=".../protocol-factory/broadcast/Deploy.s.sol/<chain-id>/run-latest.json"
OUTPUT_FILE="./src/deployments/json/<network>.json"

# Run the script
deno run --allow-read --allow-write=./src/deployments/json --allow-env --allow-run=cast \
    sync-factory-artifacts.ts \
    $SRC_PROTOCOL_ADDRESSES $SRC_DEPLOYMENT_RUN_FILE $OUTPUT_FILE
```

Note: Deno and Foundry are required.

## Security

If you believe you've found a security issue, we encourage you to notify us. We
welcome working with you to resolve the issue promptly.

Security Contact Email: sirt@aragon.org

Please do not use the issue tracker for security issues.
