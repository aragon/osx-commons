import {generateTransferEntityId} from '../../src/ids/transfer';
import {DUMMY_BYTES32_HEX} from '../constants';
import {BigInt, Bytes} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Transfer ID generation', () => {
  test('`generateTransferEntityId` should return the id representation of a transfer', () => {
    const txHash = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const logIndex = BigInt.fromI32(1);
    const actionIndex = 1;

    const expected = `${txHash.toHexString()}_${logIndex.toString()}_${actionIndex.toString()}`;
    const actual = generateTransferEntityId(txHash, logIndex, actionIndex);
    assert.stringEquals(actual, expected);
  });
});
