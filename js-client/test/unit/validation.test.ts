import {
  InvalidCidError,
  isEnsName,
  isIpfsUri,
  isProposalId,
  isSubdomain,
  resolveIpfsCid,
} from '../../src';
import {
  ADDRESS_ONE,
  TEST_ENS_NAME,
  TEST_INVALID_ENS_NAME,
  TEST_INVALID_IPFS_CID,
  TEST_INVALID_IPFS_URI,
  TEST_INVALID_SUBDOMAIN,
  TEST_IPFS_CID_V0,
  TEST_IPFS_CID_V1,
  TEST_IPFS_URI_V0,
  TEST_IPFS_URI_V1,
  TEST_SUBDOMAIN,
} from '../constants';

describe('Test Validations', () => {
  describe('resolveIpfsCid', () => {
    it("Should resolve IPFS CiD's", () => {
      let cid = TEST_IPFS_CID_V0;
      let result = resolveIpfsCid(cid);
      expect(result).toEqual(cid);

      cid = TEST_IPFS_CID_V0;
      result = resolveIpfsCid(cid);
      expect(result).toEqual(cid);
    });
    it("Should resolve IPFS URI's V0", () => {
      let cid = TEST_IPFS_CID_V0;
      let result = resolveIpfsCid(cid);
      expect(result).toEqual(TEST_IPFS_CID_V0);

      cid = TEST_IPFS_URI_V0;
      result = resolveIpfsCid(cid);
      expect(result).toEqual(TEST_IPFS_CID_V0);

      cid = `${TEST_IPFS_URI_V0}/path`;
      result = resolveIpfsCid(cid);
      expect(result).toEqual(TEST_IPFS_CID_V0);
    });
    it("Should resolve IPFS URI's V1", () => {
      let cid = TEST_IPFS_CID_V1;
      let result = resolveIpfsCid(cid);
      expect(result).toEqual(TEST_IPFS_CID_V1);

      cid = TEST_IPFS_URI_V1;
      result = resolveIpfsCid(cid);
      expect(result).toEqual(TEST_IPFS_CID_V1);

      cid = `${TEST_IPFS_URI_V1}/path`;
      result = resolveIpfsCid(cid);
      expect(result).toEqual(TEST_IPFS_CID_V1);
    });
    it('Should fail to recognize a non-IPFS origin', () => {
      expect(() => resolveIpfsCid(TEST_INVALID_IPFS_CID)).toThrow(
        new InvalidCidError()
      );
      expect(() => resolveIpfsCid(TEST_INVALID_IPFS_URI)).toThrow(
        new InvalidCidError()
      );
      expect(() => resolveIpfsCid(`${TEST_INVALID_IPFS_URI}/path`)).toThrow(
        new InvalidCidError()
      );
    });
  });
  describe('isProposalId', () => {
    it('Should recognize invalid proposal IDs', () => {
      const inputs = [
        {in: '1', out: false},
        {in: '0x1', out: false},
        {in: ADDRESS_ONE + '_0x1', out: true},
        {in: ADDRESS_ONE, out: false},
        {in: '0x1_0x1', out: false},
        {in: ADDRESS_ONE + '_0x' + '0'.repeat(64), out: true},
      ];
      for (const input of inputs) {
        expect(isProposalId(input.in)).toBe(input.out);
      }
    });
  });
  describe('isIpfsUri', () => {
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
