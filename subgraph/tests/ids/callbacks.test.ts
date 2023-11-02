import {generateStandardCallbackEntityId} from '../../src/ids/callbacks';
import {ADDRESS_ONE, DUMMY_BYTES32_HEX} from '../constants';
import {Address, Bytes} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

describe('Standard Callback Entity ID generation', () => {
  test('`generateStandardCallbackEntityId` should return the expected ID', () => {
    const dao = Address.fromString(ADDRESS_ONE);
    const interfaceId = Bytes.fromHexString(DUMMY_BYTES32_HEX);

    const expectedId = `${dao.toHexString()}_${interfaceId.toHexString()}`;

    assert.stringEquals(
      generateStandardCallbackEntityId(dao, interfaceId),
      expectedId
    );
  });
});
