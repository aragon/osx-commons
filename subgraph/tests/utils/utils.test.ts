import {bigIntToBytes32} from '../../src/utils/utils';
import {BigInt} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

describe('bigIntToBytes32', () => {
  test('should convert a BigInt to a bytes32 string with 64 zero padding', () => {
    const input = BigInt.fromI32(123);
    const expectedOutput =
      '0x000000000000000000000000000000000000000000000000000000000000007b';

    assert.stringEquals(bigIntToBytes32(input), expectedOutput);
  });
});
