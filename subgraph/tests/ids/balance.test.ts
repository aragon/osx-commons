import {
  generateBalanceEntityId,
  generateTokenIdBalanceEntityId,
} from '../../src/ids/balance';
import {ADDRESS_ONE, ADDRESS_TWO} from '../constants';
import {Address, BigInt} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

describe('Balances ID generation', () => {
  test('`generateBalanceEntityId` should return the id representation of a balance', () => {
    const dao = Address.fromString(ADDRESS_ONE);
    const token = Address.fromString(ADDRESS_TWO);

    const expected = `${dao.toHexString()}_${token.toHexString()}`;
    const actual = generateBalanceEntityId(dao, token);
    assert.stringEquals(actual, expected);
  });
  test('`generateTokenIdBalanceEntityId` should return the id representation of a token ID balance', () => {
    const dao = Address.fromString(ADDRESS_ONE);
    const token = Address.fromString(ADDRESS_TWO);
    const tokenId = BigInt.fromI32(1);
    const expected = `${dao.toHexString()}_${token.toHexString()}_${tokenId.toString()}`;
    const actual = generateTokenIdBalanceEntityId(dao, token, tokenId);
    assert.stringEquals(actual, expected);
  });
});
