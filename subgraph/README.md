# Aragon OSx Subgraph Commons

The `@aragon/osx-commons-subgraph` package provides a collection of utilities for the creation and management of subgraphs for the Aragon DAO Framework.

## Installation

To add this package to your project, navigate to your project's root directory and run:

```bash
yarn add @aragon/osx-commons-subgraph
```

## Nohoist Configuration

If this package is intended to be used with Matchstick in a mono repo, you might need to configure it to not hoist its dependencies.

This can be done by adding the following configuration to your project's root package.json file:

```json
{
  "workspaces": {
    "nohoist": ["**/@aragon/osx-commons-subgraph", "**/@aragon/osx-commons-subgraph/**"]
  }
}
```

This configuration ensures that all dependencies for the @aragon/osx-commons-subgraph package will be installed inside its own node_modules directory, which is required by Matchstick for proper functioning.

## Usage

After installing @aragon/osx-subgraph-commons, you can import and use its functions in your Subgraph project.

Example:

```ts
import {getDaoId} from '@aragon/osx-commons-subgraph';

const daoId = getDaoId(<some-dao-address>);
console.log(`The DAO ID is: ${daoId}`);
```

In this example, the getDaoId function is used to generate a DAO ID from a given Ethereum address.
