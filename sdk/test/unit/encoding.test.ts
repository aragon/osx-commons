import {InvalidProposalIdError} from '../../src';
import {
  bitmapToBoolArray,
  boolArrayToBitmap,
  bytesToHex,
  decodeProposalId,
  decodeRatio,
  encodeProposalId,
  encodeRatio,
  ensure0x,
  getCompactProposalId,
  getExtendedProposalId,
  hexToBytes,
  strip0x,
} from '../../src/encoding';
import {getEmpty256Array} from '../utils';

describe('Test encoding helper functions', () => {
  describe('ensure0x', () => {
    it('Should ensure 0x prefixes', () => {
      const inputs = [
        // strip
        {in: '0', out: '0x0'},
        {in: '00', out: '0x00'},
        {in: '1234', out: '0x1234'},
        {in: '55555555555555555555', out: '0x55555555555555555555'},
        // skip
        {in: '0x1234', out: '0x1234'},
        {in: '0xabcd', out: '0xabcd'},
        {in: '0x1234567890abcdef', out: '0x1234567890abcdef'},
      ];

      for (const input of inputs) {
        const result = ensure0x(input.in);
        expect(result).toEqual(input.out);
      }
    });
  });
  describe('strip0x', () => {
    it('Should strip 0x prefixes', () => {
      const inputs = [
        // strip
        {in: '0x0', out: '0'},
        {in: '0x00', out: '00'},
        {in: '0x1234', out: '1234'},
        {in: '0x55555555555555555555', out: '55555555555555555555'},
        // skip
        {in: '1234', out: '1234'},
        {in: 'abcd', out: 'abcd'},
        {in: '1234567890abcdef', out: '1234567890abcdef'},
      ];

      for (const input of inputs) {
        const result = strip0x(input.in);
        expect(result).toEqual(input.out);
      }
    });
  });
  describe('hexToBytes', () => {
    it('Should convert hex strings to a buffer', () => {
      const inputs = [
        {hex: '0x00', serializedBuffer: '0'},
        {hex: '0x10', serializedBuffer: '16'},
        {hex: '0xff', serializedBuffer: '255'},
        {hex: '0xffffffff', serializedBuffer: '255,255,255,255'},
        {
          hex: '0xaaaaaaaaaaaaaaaa',
          serializedBuffer: '170,170,170,170,170,170,170,170',
        },
        {hex: '00', serializedBuffer: '0'},
        {hex: '0x', serializedBuffer: ''},
        {hex: '10', serializedBuffer: '16'},
        {hex: 'ff', serializedBuffer: '255'},
        {hex: 'ffffffff', serializedBuffer: '255,255,255,255'},
        {
          hex: 'aaaaaaaaaaaaaaaa',
          serializedBuffer: '170,170,170,170,170,170,170,170',
        },
      ];

      for (const input of inputs) {
        const result = hexToBytes(input.hex);
        expect(result.join(',')).toEqual(input.serializedBuffer);
      }
    });
  });
  describe('bytesToHex', () => {
    it("Should convert Uint8Array's into hex strings", () => {
      const items = [
        {buffer: new Uint8Array([]), skip0x: false, output: '0x'},
        {buffer: new Uint8Array([]), skip0x: true, output: ''},
        {buffer: new Uint8Array([0]), skip0x: false, output: '0x00'},
        {buffer: new Uint8Array([0]), skip0x: true, output: '00'},
        {buffer: new Uint8Array([1]), skip0x: false, output: '0x01'},
        {buffer: new Uint8Array([1]), skip0x: true, output: '01'},
        {
          buffer: new Uint8Array([
            10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 250, 255,
          ]),
          skip0x: false,
          output: '0x0a141e28323c46505a64c8faff',
        },
        {
          buffer: new Uint8Array([
            10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 250, 255,
          ]),
          skip0x: true,
          output: '0a141e28323c46505a64c8faff',
        },
        {
          buffer: new Uint8Array([100, 100, 100, 100, 100, 100]),
          skip0x: false,
          output: '0x646464646464',
        },
        {
          buffer: new Uint8Array([100, 100, 100, 100, 100, 100]),
          skip0x: true,
          output: '646464646464',
        },
        {buffer: new Uint8Array([0, 255]), skip0x: false, output: '0x00ff'},
        {buffer: new Uint8Array([0, 255]), skip0x: true, output: '00ff'},
      ];

      for (const item of items) {
        const hex = bytesToHex(item.buffer, item.skip0x);
        expect(hex).toEqual(item.output);
      }
    });
  });
  describe('encodeRatio', () => {
    it('Should encode a bigint from a float and the number of digits', () => {
      const inputs = [
        {float: 0.5, digits: 1, out: BigInt(5)},
        {float: 1, digits: 4, out: BigInt(10000)},
        {float: 0.25555, digits: 2, out: BigInt(26)},
        {float: 0.123456789, digits: 15, out: BigInt(123456789000000)},
      ];

      for (const input of inputs) {
        const result = encodeRatio(input.float, input.digits);
        expect(result.toString()).toEqual(input.out.toString());
      }

      expect(() => encodeRatio(0.5, -1)).toThrow(
        'The number of digits should range between 1 and 15'
      );
      expect(() => encodeRatio(0.5, 18)).toThrow(
        'The number of digits should range between 1 and 15'
      );
    });
  });
  describe('decodeRatio', () => {
    it('Should decode a float from a given bigint and a number of digits', () => {
      const inputs = [
        {bigint: BigInt(5), digits: 1, out: 0.5},
        {bigint: BigInt(5456), digits: 4, out: 0.5456},
        {bigint: 5, digits: 1, out: 0.5},
        {bigint: 5456, digits: 4, out: 0.5456},
        {bigint: BigInt('1'), digits: 9, out: 0.000000001},
        {bigint: BigInt('367483947'), digits: 9, out: 0.367483947},
        {bigint: 1, digits: 9, out: 0.000000001},
        {bigint: 367483947, digits: 9, out: 0.367483947},
      ];

      for (const input of inputs) {
        const result = decodeRatio(input.bigint, input.digits);
        expect(result).toEqual(input.out);
      }

      expect(() => decodeRatio(Number.MAX_SAFE_INTEGER + 1, 12)).toThrow(
        'The value is out of range'
      );
      expect(() => decodeRatio(BigInt('512345898367483947'), 12)).toThrow(
        'The value is out of range'
      );
      expect(() => decodeRatio(10 ** 2, 1)).toThrow(
        'The value is out of range'
      );
      expect(() => decodeRatio(10 ** 10, 9)).toThrow(
        'The value is out of range'
      );
    });
  });
  describe('encodeProposalId', () => {
    it('Should encode a nonce-based proposalId', () => {
      const entries = [
        {
          addr: '0x0000000000000000000000000000000000000000',
          nonce: 0,
          output: '0x0000000000000000000000000000000000000000_0x0',
        },
        {
          addr: '0x0000000000000000000000000000000000000000',
          nonce: 1,
          output: '0x0000000000000000000000000000000000000000_0x1',
        },
        {
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 1,
          output: '0x1111111111111111111111111111111111111111_0x1',
        },
        {
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 10,
          output: '0x1111111111111111111111111111111111111111_0xa',
        },
        {
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 15,
          output: '0x1111111111111111111111111111111111111111_0xf',
        },
        {
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 16,
          output: '0x1111111111111111111111111111111111111111_0x10',
        },
        {
          addr: '0x1111111111111111111111111111111111111111',
          nonce: 1 << 24,
          output: '0x1111111111111111111111111111111111111111_0x1000000',
        },
      ];

      for (const entry of entries) {
        expect(encodeProposalId(entry.addr, entry.nonce)).toBe(entry.output);
      }
    });
  });
  describe('decodeProposalId', () => {
    it('Should decode a nonce-based proposalId', () => {
      const entries = [
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

      for (const entry of entries) {
        const result = decodeProposalId(entry.input);
        expect(result.pluginAddress).toBe(entry.addr);
        expect(result.id).toBe(entry.nonce);
      }
    });
  });
  describe('boolArrayToBitmap', () => {
    it('boolArrayToBitmap should fail when the array is too large', () => {
      expect(() => {
        const tmp = getEmpty256Array();
        tmp.push(false);
        boolArrayToBitmap(tmp);
      }).toThrow();
    });
    it('should transform a boolean array into a bigint bitmap', () => {
      const tests = [
        {input: undefined, output: BigInt(0)},
        {input: [], output: BigInt(0)},
        {input: [false], output: BigInt(0)},
        {input: [true], output: BigInt(1)},
        {input: [true, false], output: BigInt(1)},
        {input: [true, false, false, false, false, false], output: BigInt(1)},
        {input: [false, true, false, true], output: BigInt(10)},
        {input: getEmpty256Array(), output: BigInt(0)},
      ];
      let input = getEmpty256Array();
      input[0] = true;
      tests.push({input, output: BigInt(1) << BigInt(0)});

      input = getEmpty256Array();
      input[100] = true;
      tests.push({input, output: BigInt(1) << BigInt(100)});

      input = getEmpty256Array();
      input[150] = true;
      tests.push({input, output: BigInt(1) << BigInt(150)});

      for (const entry of tests) {
        expect(boolArrayToBitmap(entry.input)).toEqual(entry.output);
      }
    });
  });
  describe('bitmapToBoolArray', () => {
    it('should transform a bigint bitmap into a boolean array', () => {
      const tests = [{input: BigInt(0), output: getEmpty256Array()}];
      let output = getEmpty256Array();
      output[0] = true;
      tests.push({input: BigInt(1) << BigInt(0), output});

      output = getEmpty256Array();
      output[1] = true;
      tests.push({input: BigInt(1) << BigInt(1), output});

      output = getEmpty256Array();
      output[2] = true;
      tests.push({input: BigInt(1) << BigInt(2), output});

      output = getEmpty256Array();
      output[5] = true;
      tests.push({input: BigInt(1) << BigInt(5), output});

      output = getEmpty256Array();
      output[100] = true;
      tests.push({input: BigInt(1) << BigInt(100), output});

      output = getEmpty256Array();
      output[150] = true;
      tests.push({input: BigInt(1) << BigInt(150), output});

      for (const entry of tests) {
        expect(bitmapToBoolArray(entry.input)).toMatchObject(entry.output);
      }
    });

    it('should fail when the bigint is too large', () => {
      expect(() => {
        bitmapToBoolArray(BigInt(1) << BigInt(256));
      }).toThrow();
    });
  });
  describe('getExtendedProposalId', () => {
    it('Should get an extended version of a proposal id', () => {
      const entries = [
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

      for (const entry of entries) {
        if (entry.error) {
          expect(() => getExtendedProposalId(entry.in)).toThrow(entry.error);
        } else {
          const result = getExtendedProposalId(entry.in);
          expect(result).toBe(entry.out);
        }
      }
    });
  });
  describe('getCompactProposalId', () => {
    it('Should get a compact version of a proposal id', () => {
      const entries = [
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
          in: 'invalid_proposal',
          out: '',
          error: 'Invalid proposalId',
        },
        {
          in: '0x0000000000000000000000000000000000000000_0x000000000000000000000000000000000000000000000000000000000000pppp',
          out: '',
          error: 'Invalid proposalId',
        },
      ];

      for (const entry of entries) {
        if (entry.error) {
          expect(() => getCompactProposalId(entry.in)).toThrow(entry.error);
        } else {
          const result = getCompactProposalId(entry.in);
          expect(result).toBe(entry.out);
        }
      }
    });
  });
});
