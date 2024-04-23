import {
  InvalidEnsError,
  isEnsName,
  isSubdomain,
  resolveEnsName,
} from '../../src';
import {
  ADDRESS_ONE,
  TEST_ENS_NAME,
  TEST_HTTP_URI,
  TEST_INVALID_ENS_NAME,
  TEST_INVALID_SUBDOMAIN,
  TEST_SUBDOMAIN,
} from '../constants';
import {JsonRpcProvider} from '@ethersproject/providers';

describe('ens', () => {
  describe('resolveEnsName', () => {
    it('should receive a JsonRpcProvider and return the correct value', async () => {
      const tests = [
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
      for (const test of tests) {
        // mocked provider
        const provider = new JsonRpcProvider();
        if (test.error) {
          await expect(
            async () => await resolveEnsName(test.input, provider)
          ).rejects.toThrow(test.error);
          continue;
        }
        jest.spyOn(provider, 'resolveName').mockResolvedValue(test.output);
        const resolvedAddress = await resolveEnsName(test.input, provider);
        expect(resolvedAddress).toEqual(test.output);
      }
    });
    it('should receive a Networkish and return the correct value', async () => {
      const tests = [
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
      for (const test of tests) {
        // mocked provider
        if (test.error) {
          await expect(
            async () => await resolveEnsName(test.input, test.network)
          ).rejects.toThrow(test.error);
          continue;
        }
        jest
          .spyOn(JsonRpcProvider.prototype, 'resolveName')
          .mockResolvedValue(test.output);
        const resolvedAddress = await resolveEnsName(test.input, test.network);
        expect(resolvedAddress).toEqual(test.output);
      }
    });
  });
  describe('isSubdomain', () => {
    const inputs = [
      {in: TEST_SUBDOMAIN, out: true},
      {in: TEST_INVALID_SUBDOMAIN, out: false},
    ];
    for (const input of inputs) {
      expect(isSubdomain(input.in)).toBe(input.out);
    }
  });
  describe('isEnsName', () => {
    const inputs = [
      {in: TEST_ENS_NAME, out: true},
      {in: TEST_INVALID_ENS_NAME, out: false},
    ];
    for (const input of inputs) {
      expect(isEnsName(input.in)).toBe(input.out);
    }
  });
});
