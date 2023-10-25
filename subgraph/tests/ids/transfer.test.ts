import {generateTransferEntityId} from '../../src/ids/transfer';
import {DUMMY_BYTES32_HEX} from '../constants';
import {BigInt, Bytes} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

describe('Transfer ID generation', () => {
  test('`generateTransferEntityId` should return the id representation of a transfer', () => {
    const txHash = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const logIndex = BigInt.fromI32(1);
    const actionIndex = 1;

    const expectedId = `${txHash.toHexString()}_${logIndex.toString()}_${actionIndex.toString()}`;

    assert.stringEquals(
      generateTransferEntityId(txHash, logIndex, actionIndex),
      expectedId
    );
  });
});
