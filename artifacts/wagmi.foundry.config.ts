import {defineConfig} from '@wagmi/cli';
import {foundry} from '@wagmi/cli/plugins';

export default defineConfig({
  // using abi instead of generated to avoid being ignored by git
  out: 'generated/abis.ts',
  plugins: [
    foundry({
      project: './',
      // artifacts: 'REPLACE_ARTIFACTS_SOURCE',
      exclude: ['**/test/**', '**/mocks/**'],
    }),
  ],
});