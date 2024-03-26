import {bigIntToBytes32} from '../../src/utils/utils';
import {BigInt} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const ONE_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000001';
const HALF_UINT256_BYTES32 =
  '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
const MAX_UINT256_BYTES32 =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const MAX_UINT256_NUMBER_STRING =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935';

describe('bigIntToBytes32', () => {
  test('should successfully convert a range of `bigInt`s', function () {
    const MAX_UINT256 = BigInt.fromString(MAX_UINT256_NUMBER_STRING);

    assert.stringEquals(bigIntToBytes32(BigInt.fromString('0')), ZERO_BYTES32);
    assert.stringEquals(bigIntToBytes32(BigInt.fromString('1')), ONE_BYTES32);
    assert.stringEquals(
      bigIntToBytes32(MAX_UINT256.div(BigInt.fromString('2'))),
      HALF_UINT256_BYTES32
    );
    assert.stringEquals(bigIntToBytes32(MAX_UINT256), MAX_UINT256_BYTES32);
  });
});
