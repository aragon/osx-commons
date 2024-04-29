import {generateDaoEntityId} from '../../src';
import {ADDRESS_ONE} from '../constants';
import {Address} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('DAO ID generation', () => {
  test('`generateDaoEntityId` should return the hexadecimal representation of the provided address', () => {
    const address = Address.fromString(ADDRESS_ONE);
    assert.stringEquals(generateDaoEntityId(address), ADDRESS_ONE);
  });
});
