import {
  generatePermissionEntityId,
  generatePluginPermissionEntityId,
  generatePluginPreparationEntityId,
} from '../../src';
import {
  ADDRESS_ZERO,
  ADDRESS_ONE,
  ADDRESS_TWO,
  DUMMY_BYTES32_HEX,
} from '../constants';
import {Address, Bytes} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('DAO Permissions ID generation', () => {
  test('`generatePermissionEntityId` should return the id representation of a permission', () => {
    const emittingContract = Address.fromString(ADDRESS_ZERO);
    const permissionId = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const where = Address.fromString(ADDRESS_ONE);
    const who = Address.fromString(ADDRESS_TWO);

    const expectedId = `${emittingContract.toHexString()}_${permissionId.toHexString()}_${where.toHexString()}_${who.toHexString()}`;

    assert.stringEquals(
      generatePermissionEntityId(emittingContract, permissionId, where, who),
      expectedId
    );
  });
});

describe('Plugin Permissions ID generation', () => {
  test('`generatePluginPermissionEntityId` should return a concatenated unique ID string for the plugin permission', () => {
    // Constants
    const OPERATION: i32 = 1;
    const WHERE_ADDRESS = Address.fromString(ADDRESS_ONE);
    const WHO_ADDRESS = Address.fromString(ADDRESS_TWO);
    const PERMISSION_ID = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const PLUGIN_PREPARATION_ID = generatePluginPreparationEntityId(
      DUMMY_BYTES32_HEX,
      Bytes.fromHexString(DUMMY_BYTES32_HEX)
    );

    // Generate the pluginPermissionEntityId
    const pluginPermissionEntityId = generatePluginPermissionEntityId(
      PLUGIN_PREPARATION_ID,
      OPERATION,
      WHERE_ADDRESS,
      WHO_ADDRESS,
      PERMISSION_ID
    );

    const expectedId = `${PLUGIN_PREPARATION_ID}_${OPERATION}_${WHERE_ADDRESS.toHexString()}_${WHO_ADDRESS.toHexString()}_${PERMISSION_ID.toHexString()}`;

    assert.stringEquals(pluginPermissionEntityId, expectedId);
  });
});
