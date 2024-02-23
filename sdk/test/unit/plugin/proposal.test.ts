import {
  encodeProposalId,
  decodeProposalId,
  getCompactProposalId,
  getExtendedProposalId,
  InvalidProposalIdError,
} from '../../../src';
import {ADDRESS_ONE, ADDRESS_ZERO} from '../../constants';

describe('plugin/proposal', () => {
  describe('encodeProposalId', () => {
    it('Should encode a nonce-based proposalId', () => {
      const tests = [
        {
          addr: ADDRESS_ZERO,
          nonce: 0,
          output: `${ADDRESS_ZERO}_0x0`,
        },
        {
          addr: ADDRESS_ZERO,
          nonce: 1,
          output: `${ADDRESS_ZERO}_0x1`,
        },
        {
          addr: ADDRESS_ONE,
          nonce: 0,
          output: `${ADDRESS_ONE}_0x0`,
        },
        {
          addr: ADDRESS_ONE,
          nonce: 10,
          output: `${ADDRESS_ONE}_0xa`,
        },
        {
          addr: ADDRESS_ONE,
          nonce: 15,
          output: `${ADDRESS_ONE}_0xf`,
        },
        {
          addr: ADDRESS_ONE,
          nonce: 16,
          output: `${ADDRESS_ONE}_0x10`,
        },
        {
          addr: ADDRESS_ONE,
          nonce: 1 << 24,
          output: `${ADDRESS_ONE}_0x1000000`,
        },
      ];

      for (const test of tests) {
        expect(encodeProposalId(test.addr, test.nonce)).toBe(test.output);
      }
    });
  });
  describe('decodeProposalId', () => {
    it('Should decode a nonce-based proposalId', () => {
      const tests = [
        {
          input: '0x0000000000000000000000000000000000000000_0x0',
          addr: '0x0000000000000000000000000000000000000000',
          nonce: 0,
        },
        {
          input: '0x0000000000000000000000000000000000000000_0x1',
          addr: '0x0000000000000000000000000000000000000000',
          nonce: 1,
        },
        {
          input: '0x1111111111111111111111111111111111111111_0x1',
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 1,
        },
        {
          input: '0x1111111111111111111111111111111111111111_0xa',
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 10,
        },
        {
          input: '0x1111111111111111111111111111111111111111_0xf',
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 15,
        },
        {
          input: '0x1111111111111111111111111111111111111111_0x10',
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 16,
        },
        {
          input: '0x1111111111111111111111111111111111111111_0x1000000',
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 1 << 24,
        },
      ];

      for (const test of tests) {
        const result = decodeProposalId(test.input);
        expect(result.pluginAddress).toBe(test.addr);
        expect(result.id).toBe(test.nonce);
      }
    });
  });
  describe('getExtendedProposalId', () => {
    it('Should get an extended version of a proposal id', () => {
      const tests = [
        {
          in: '0x0000000000000000000000000000000000000000_0x1',
          out: '0x0000000000000000000000000000000000000000_0x0000000000000000000000000000000000000000000000000000000000000001',
          error: '',
        },
        {
          in: '0x0000000000000000000000000000000000000000_0xffff',
          out: '0x0000000000000000000000000000000000000000_0x000000000000000000000000000000000000000000000000000000000000ffff',
          error: '',
        },
        {
          in: 'invalid_proposal',
          out: '',
          error: InvalidProposalIdError,
        },
        {
          in: '0x0000000000000000000000000000000000000000_0x000000000000000000000000000000000000000000000000000000000000pppp',
          out: '',
          error: InvalidProposalIdError,
        },
      ];

      for (const test of tests) {
        if (test.error) {
          expect(() => getExtendedProposalId(test.in)).toThrow(test.error);
        } else {
          const result = getExtendedProposalId(test.in);
          expect(result).toBe(test.out);
        }
      }
    });
  });
  describe('getCompactProposalId', () => {
    it('Should get a compact version of a proposal id', () => {
      const tests = [
        {
          in: '0x0000000000000000000000000000000000000000_0x0000000000000000000000000000000000000000000000000000000000000001',
          out: '0x0000000000000000000000000000000000000000_0x1',
          error: '',
        },
        {
          in: '0x0000000000000000000000000000000000000000_0x000000000000000000000000000000000000000000000000000000000000ffff',
          out: '0x0000000000000000000000000000000000000000_0xffff',
          error: '',
        },
        {
          in: '0x0000000000000000000000000000000000000000_0x1',
          out: '',
          error:
            '"0x0000000000000000000000000000000000000000_0x1" is not a valid proposal id.',
        },
        {
          in: 'invalid_proposal',
          out: '',
          error: '"invalid_proposal" is not a valid proposal id.',
        },
        {
          in: '0x0000000000000000000000000000000000000000_0x000000000000000000000000000000000000000000000000000000000000pppp',
          out: '',
          error:
            '"0x0000000000000000000000000000000000000000_0x000000000000000000000000000000000000000000000000000000000000pppp" is not a valid proposal id.',
        },
      ];

      for (const test of tests) {
        if (test.error) {
          expect(() => getCompactProposalId(test.in)).toThrow(test.error);
        } else {
          const result = getCompactProposalId(test.in);
          expect(result).toBe(test.out);
        }
      }
    });
  });
});
