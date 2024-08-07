import {defineConfig} from '@wagmi/cli';
import {hardhat} from '@wagmi/cli/plugins';

export default defineConfig({
  // using abi instead of generated to avoid being ignored by git
  out: 'generated/abis.ts',
  plugins: [
    hardhat({
      project: './',
      artifacts: 'REPLACE_ARTIFACTS_SOURCE',
      exclude: ['**/test/**', '**/mocks/**'],
    }),
  ],
});
