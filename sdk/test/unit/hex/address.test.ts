import {isAddress} from '../../../src';
import {
  ADDRESS_ONE,
  ADDRESS_ZERO,
  TEST_ENS_NAME,
  TEST_WALLET,
  TEST_WALLET_ADDRESS,
} from '../../constants';

describe('hex/address', () => {
  describe('isAddress', () => {
    it('should validate addresses', () => {
      const tests = [
        {input: '0x', output: false},
        {input: '0x0', output: false},
        {input: ADDRESS_ZERO, output: true},
        {input: ADDRESS_ONE, output: true},
        {input: TEST_WALLET_ADDRESS, output: true},
        {input: TEST_WALLET, output: false},
        {input: TEST_ENS_NAME, output: false},
      ];
      for (const test of tests) {
        expect(isAddress(test.input)).toBe(test.output);
      }
    });
  });
});
