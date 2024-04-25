import {
  InvalidDigitsValueError,
  ValueOutOfRangeError,
  decodeRatio,
  encodeRatio,
} from '../../src';

describe('ratio', () => {
  describe('encodeRatio', () => {
    it('Should encode a bigint from a float and the number of digits', () => {
      const tests = [
        {float: 0.5, digits: 1, out: BigInt(5), error: null},
        {float: 1, digits: 4, out: BigInt(10000), error: null},
        {float: 0.25555, digits: 2, out: BigInt(26), error: null},
        {
          float: 0.123456789,
          digits: 15,
          out: BigInt(123456789000000),
          error: null,
        },
        {float: 0.5, digits: -1, out: null, error: InvalidDigitsValueError},
        {float: 0.5, digits: 18, out: null, error: InvalidDigitsValueError},
      ];

      for (const test of tests) {
        if (test.error) {
          expect(() => encodeRatio(test.float, test.digits)).toThrow(
            test.error
          );
          continue;
        }
        const result = encodeRatio(test.float, test.digits);
        expect(result.toString()).toEqual(test.out?.toString());
      }
    });
  });
  describe('decodeRatio', () => {
    it('Should decode a float from a given bigint and a number of digits', () => {
      const tests = [
        {bigint: BigInt(5), digits: 1, out: 0.5, error: null},
        {bigint: BigInt(5456), digits: 4, out: 0.5456, error: null},
        {bigint: 5, digits: 1, out: 0.5, error: null},
        {bigint: 5456, digits: 4, out: 0.5456, error: null},
        {bigint: BigInt('1'), digits: 9, out: 0.000000001, error: null},
        {bigint: BigInt('367483947'), digits: 9, out: 0.367483947, error: null},
        {bigint: 1, digits: 9, out: 0.000000001, error: null},
        {bigint: 367483947, digits: 9, out: 0.367483947, error: null},
        {
          bigint: Number.MAX_SAFE_INTEGER + 1,
          digits: 12,
          out: null,
          error: ValueOutOfRangeError,
        },
        {
          bigint: BigInt('512345898367483947'),
          digits: 12,
          out: null,
          error: ValueOutOfRangeError,
        },
        {
          bigint: 10 ** 2,
          digits: 1,
          out: null,
          error: ValueOutOfRangeError,
        },
        {
          bigint: 10 ** 10,
          digits: 9,
          out: null,
          error: ValueOutOfRangeError,
        },
      ];

      for (const test of tests) {
        if (test.error) {
          expect(() => decodeRatio(test.bigint, test.digits)).toThrow(
            test.error
          );
          continue;
        }
        const result = decodeRatio(test.bigint, test.digits);
        expect(result).toEqual(test.out);
      }
    });
  });
});
