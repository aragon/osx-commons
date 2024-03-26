import {generateActionEntityId} from '../../src';
import {ADDRESS_ONE, ADDRESS_TWO} from '../constants';
import {Address} from '@graphprotocol/graph-ts';
import {describe, test, assert} from 'matchstick-as';

function checksum(s: string): string {
  return Address.fromHexString(s).toHexString();
}

describe('Actions ID generation', () => {
  test('We correctly generate the action ID', () => {
    let caller = ADDRESS_ONE;
    let daoAddress = ADDRESS_TWO;
    let callId = 'c4ll me';
    let index = 255;

    let actionId = generateActionEntityId(
      Address.fromString(caller),
      Address.fromString(daoAddress),
      callId,
      index
    );

    assert.stringEquals(
      actionId,
      [checksum(caller), checksum(daoAddress), callId, index.toString()].join(
        '_'
      )
    );
  });
});
