import {defineConfig} from '@wagmi/cli';
import {foundry} from '@wagmi/cli/plugins';

// CONTRACTS_TO_INCLUDE is needed because foundry has not folder structure in the artifacts,
// if this is not defined it will generate the type of all the compiled contracts in the out folder
// check here https://github.com/foundry-rs/foundry/issues/1573

export default defineConfig({
  // using abi instead of generated to avoid being ignored by git
  out: 'generated/abis.ts',
  plugins: [
    foundry({
      project: './',
      include: (() => {
        return JSON.parse(process.env.CONTRACTS_TO_INCLUDE || '[]').map(
          (contractName: string) => `${contractName}.json`
        );
      })(),
    }),
  ],
});
