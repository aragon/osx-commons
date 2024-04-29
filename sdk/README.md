# Aragon OSx Commons SDK

`@aragon/osx-commons-sdk` provides common utilities for the development of plugins and the OSx protocol. This includes:

- common helper functionality for
  - web3 interaction
  - subgraph interaction
  - file storage on IPFS
  - retrieving addresses of deployed Aragon OSx framework contracts
  - contract deployment
  - contract testing
- base classes for creating custom JS clients on top of the built-in one.

- Extendable JS client with built-in Web3, Subgraph and IPFS
- Extendable context for holding inheritable configuration

## Installation

Use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) to install
@aragon/osx-commons-sdk.

```bash
npm install @aragon/osx-commons-sdk
yarn add @aragon/osx-commons-sdk
```

## Usage

The SDK usage is demonstrated in the
[SDK examples section of the Developer Portal](https://devs.aragon.org/docs/sdk/examples/).

## React Native

In order for the SDK to be used in restricted environments like react native
install the following polyfilesand into your project:

- [@ethersproject/shims](https://www.npmjs.com/package/@ethersproject/shims)
- [react-native-url-polyfill](https://www.npmjs.com/package/react-native-url-polyfill)

Then import them like the following **before** you import the Aragon SDK
package:

```javascript
import {Client} from '@aragon/osx-commons-sdk';
import '@ethersproject/shims';
import 'react-native-url-polyfill/auto';
```

## Low level networking

See `ClientCore` ([source](./src/internal/core.ts)):

- Abstract class implementing primitives for:
  - Web3, contracts, signing
  - IPFS
  - GraphQL
- Inherited by classes like `Client` and all plugin classes like
  `TokenVotingClient`.

## Common interfaces, types, enum's

When updating the `ClientCore` class:

- **Update first** all affected enum's, types and interfaces in
  `src/internal/interfaces.ts`

## Testing

To execute library tests just run:

```bash
yarn test
```

## Security

If you believe you've found a security issue, we encourage you to notify us. We welcome working with you to resolve the issue promptly.

Security Contact Email: sirt@aragon.org

Please do not use the issue tracker for security issues.
