import {
  bitmapToBoolArray,
  flipBit,
  getBit,
  boolArrayToBitmap,
  InvalidBitPositionError,
} from '../../src';
import {getEmpty256Array} from '../utils';
import {BigNumber} from '@ethersproject/bignumber';

describe('bitmap', () => {
  describe('flipBit', () => {
    test('should flip the bit at the given index', function () {
      const inputs = [
        {index: 0, num: BigNumber.from(0), expected: BigNumber.from(1)},
        {index: 2, num: BigNumber.from(0), expected: BigNumber.from(4)},
        {index: 2, num: BigNumber.from(10), expected: BigNumber.from(14)},
        {
          index: -30,
          num: BigNumber.from(0),
          expected: null,
          error: new InvalidBitPositionError(-30),
        },
        {
          index: 280,
          num: BigNumber.from(0),
          expected: null,
          error: new InvalidBitPositionError(280),
        },
      ];
      for (const input of inputs) {
        if (input.error) {
          expect(() => {
            flipBit(input.index, input.num);
          }).toThrow(input.error);
          continue;
        }
        const flippedNum = flipBit(input.index, input.num);
        expect(flippedNum.toString()).toEqual(input.expected.toString());
      }
    });
  });
  describe('getBit', () => {
    test('should return true if the bit at the given index is set', function () {
      const inputs = [
        {index: 0, num: BigNumber.from(1), expected: true},
        {index: 2, num: BigNumber.from(4), expected: true},
        {index: 2, num: BigNumber.from(14), expected: true},
        {
          index: -30,
          num: BigNumber.from(0),
          expected: null,
          error: new InvalidBitPositionError(-30),
        },
        {
          index: 280,
          num: BigNumber.from(0),
          expected: null,
          error: new InvalidBitPositionError(280),
        },
      ];
      for (const input of inputs) {
        if (input.error) {
          expect(() => {
            flipBit(input.index, input.num);
          }).toThrow(input.error);
          continue;
        }
        const isSet = getBit(input.index, input.num);
        expect(isSet).toEqual(input.expected);
      }
    });
    test('should return false if the bit at the given index is not set', function () {
      const inputs = [
        {index: 0, num: BigNumber.from(0), expected: false},
        {index: 2, num: BigNumber.from(0), expected: false},
        {index: 2, num: BigNumber.from(10), expected: false},
      ];
      for (const input of inputs) {
        const isSet = getBit(input.index, input.num);
        expect(isSet).toEqual(input.expected);
      }
    });
  });

  describe('bitmapToBoolArray', () => {
    it('should fail when the bigint is too large', () => {
      expect(() => {
        bitmapToBoolArray(BigInt(1) << BigInt(256));
      }).toThrow();
    });
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
  });
  describe('boolArrayToBitMap', () => {
    it('boolArrayToBitmap should fail when the array is too large', () => {
      expect(() => {
        const tmp = getEmpty256Array();
        tmp.push(false);
        boolArrayToBitmap(tmp);
      }).toThrow();
    });
    it('should transform a boolean array into a bigint bitmap', () => {
      const tests = [
        {input: getEmpty256Array(), output: BigInt(0)},
        {
          input: getEmpty256Array().fill(true),
          output: BigInt(2 ** 256) - BigInt(1),
        },
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
});
