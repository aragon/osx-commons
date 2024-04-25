import {isIpfsCid, isIpfsUri} from '../../src';
import {
  TEST_INVALID_IPFS_URI,
  TEST_IPFS_CID_V0,
  TEST_IPFS_CID_V1,
  TEST_IPFS_URI_V0,
  TEST_IPFS_URI_V1,
} from '../constants';

describe('ipfs', () => {
  describe('isIpfsUri', () => {
    it('Should validate IPFS URIs V1 and V0', () => {
      const inputs = [
        {in: TEST_IPFS_CID_V0, out: false},
        {in: TEST_IPFS_CID_V1, out: false},
        {in: TEST_INVALID_IPFS_URI, out: false},
        {in: TEST_IPFS_URI_V0, out: true},
        {in: TEST_IPFS_URI_V1, out: true},
      ];
      for (const input of inputs) {
        expect(isIpfsUri(input.in)).toBe(input.out);
      }
    });
  });
  describe('isIpfsCid', () => {
    it('Should validate IPFS CIDs V1 and V0', () => {
      const inputs = [
        {in: TEST_IPFS_CID_V0, out: true},
        {in: TEST_IPFS_CID_V1, out: true},
        {in: TEST_INVALID_IPFS_URI, out: false},
        {in: TEST_IPFS_URI_V0, out: false},
        {in: TEST_IPFS_URI_V1, out: false},
      ];
      for (const input of inputs) {
        expect(isIpfsCid(input.in)).toBe(input.out);
      }
    });
  });
});
