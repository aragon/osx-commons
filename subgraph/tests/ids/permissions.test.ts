import {Address, Bytes} from '@graphprotocol/graph-ts';
import {
  getPermissionId,
  getPluginPermissionId,
  getPluginPreparationId
} from '../../src';
import {assert, describe, test} from 'matchstick-as/assembly/index';
import {
  ADDRESS_ZERO,
  ADDRESS_ONE,
  ADDRESS_TWO,
  DUMMY_BYTES32_HEX
} from '../constants';
import {PERMISSION_OPERATIONS} from '../../src/utils/constants';

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe('Permissions ID generation', () => {
  test('`getPermissionId` should return the id representation of a permission', () => {
    const emittingContract = Address.fromString(ADDRESS_ZERO);
    const permissionId = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const where = Address.fromString(ADDRESS_ONE);
    const who = Address.fromString(ADDRESS_TWO);

    const expectedId = `${emittingContract.toHexString()}_${permissionId.toHexString()}_${where.toHexString()}_${who.toHexString()}`;

    assert.stringEquals(
      getPermissionId(emittingContract, permissionId, where, who),
      expectedId
    );
  });

  test('`getPluginPermissionId` should return a concatenated unique ID string for the plugin permission', () => {
    // Constants
    const OPERATION: i32 = 1;
    const WHERE_ADDRESS = Address.fromString(ADDRESS_ONE);
    const WHO_ADDRESS = Address.fromString(ADDRESS_TWO);
    const PERMISSION_ID = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const PLUGIN_PREPARATION_ID = getPluginPreparationId(
      DUMMY_BYTES32_HEX,
      Bytes.fromHexString(DUMMY_BYTES32_HEX)
    );

    // Generate the pluginPermissionId
    const pluginPermissionId = getPluginPermissionId(
      PLUGIN_PREPARATION_ID,
      OPERATION,
      WHERE_ADDRESS,
      WHO_ADDRESS,
      PERMISSION_ID
    );

    const expectedId = `${PLUGIN_PREPARATION_ID}_${PERMISSION_OPERATIONS.get(
      OPERATION
    )}_${WHERE_ADDRESS.toHexString()}_${WHO_ADDRESS.toHexString()}_${PERMISSION_ID.toHexString()}`;

    assert.stringEquals(pluginPermissionId, expectedId);
  });
});
