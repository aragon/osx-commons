import {isProposalId, isExtendedProposalId} from '../../../src';
import {TEST_ADDRESS} from '../../constants';
import {hexZeroPad} from '@ethersproject/bytes';

const tests = [
  {input: '0x', output: false},
  {input: '0x00', output: false},
  {input: '', output: false},
  {input: TEST_ADDRESS, output: false},
  {input: `${TEST_ADDRESS}_${hexZeroPad('0x1', 32)}`, output: true},
];
describe('hex/proposal', () => {
  describe('isExtendedProposalId', () => {
    it('should validate extended proposal ids', () => {
      for (const test of [
        ...tests,
        {input: `${TEST_ADDRESS}_${TEST_ADDRESS}`, output: false},
        {input: `${TEST_ADDRESS}_0x1`, output: false},
      ]) {
        expect(isExtendedProposalId(test.input)).toBe(test.output);
      }
    });
  });
  describe('isProposalId', () => {
    it('should validate proposal ids', () => {
      for (const test of [
        ...tests,
        {input: `${TEST_ADDRESS}_${TEST_ADDRESS}`, output: true},
        {input: `${TEST_ADDRESS}_0x1`, output: true},
      ]) {
        expect(isProposalId(test.input)).toBe(test.output);
      }
    });
  });
});
