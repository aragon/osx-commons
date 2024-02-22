import {
  InvalidEnsError,
  resolveEnsName,
  resolveEnsNameWithProvider,
} from '../../src';
import {ADDRESS_ONE, TEST_ENS_NAME, TEST_HTTP_URI} from '../constants';
import {JsonRpcProvider} from '@ethersproject/providers';

describe('ens', () => {
  describe('resolveEnsName', () => {
    it('should return the correct value', async () => {
      const inputs = [
        {
          input: TEST_ENS_NAME,
          network: 'mainnet',
          output: ADDRESS_ONE,
        },
        {
          input: TEST_HTTP_URI,
          network: 'mainnet',
          output: '',
          error: new InvalidEnsError(TEST_HTTP_URI),
        },
      ];
      for (const input of inputs) {
        // mocked provider
        const provider = new JsonRpcProvider();
        if (input.error) {
          await expect(
            async () => await resolveEnsName(input.input, provider)
          ).rejects.toThrow(input.error);
          continue;
        }
        jest.spyOn(provider, 'resolveName').mockResolvedValue(input.output);
        const resolvedAddress = await resolveEnsName(input.input, provider);
        expect(resolvedAddress).toEqual(input.output);
      }
    });
  });
  describe('resolveEnsNameWithProvider', () => {
    it('should return the correct value', async () => {
      const inputs = [
        {
          input: TEST_ENS_NAME,
          network: 'mainnet',
          output: ADDRESS_ONE,
        },
        {
          input: TEST_HTTP_URI,
          network: 'mainnet',
          output: '',
          error: new InvalidEnsError(TEST_HTTP_URI),
        },
      ];
      for (const input of inputs) {
        // mocked provider
        if (input.error) {
          await expect(
            async () =>
              await resolveEnsNameWithProvider(input.input, input.network)
          ).rejects.toThrow(input.error);
          continue;
        }
        jest
          .spyOn(JsonRpcProvider.prototype, 'resolveName')
          .mockResolvedValue(input.output);
        const resolvedAddress = await resolveEnsNameWithProvider(
          input.input,
          input.network
        );
        expect(resolvedAddress).toEqual(input.output);
      }
    });
  });
});
