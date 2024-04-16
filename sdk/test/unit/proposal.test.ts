import {proposalIdToBytes32} from '../../src';

describe('proposal', () => {
  describe('proposalIdToBytes32', () => {
    it('should return the correct bytes32', () => {
      const proposalId = 123;
      const bytes32 = proposalIdToBytes32(proposalId);
      expect(bytes32).toEqual(
        '0x000000000000000000000000000000000000000000000000000000000000007b'
      );
    });
  });
});
