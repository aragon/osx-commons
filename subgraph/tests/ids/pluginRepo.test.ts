import {Address, Bytes, crypto} from '@graphprotocol/graph-ts';
import {assert, describe, log, test} from 'matchstick-as/assembly/index';
import {
  getPluginRepoId,
  getPluginSetupId,
  getPluginInstallationId,
  getPluginPreparationId,
  getPluginReleaseId,
  getPluginVersionId,
  getPluginPermissionId
} from '../../src';
import {
  ADDRESS_ONE,
  ADDRESS_TWO,
  DUMMY_BYTES32_HEX,
  DUMMY_INSTALLATION_ID
} from '../constants';
import {PERMISSION_OPERATIONS} from '../../src/utils/constants';

describe('PluginRepo ID generation', () => {
  test('`getPluginRepoId` should return the hexadecimal representation of the provided address', () => {
    // Constants
    const PLUGIN_REPO_ADDRESS = Address.fromString(ADDRESS_ONE);

    assert.stringEquals(getPluginRepoId(PLUGIN_REPO_ADDRESS), ADDRESS_ONE);
  });

  test('`getPluginSetupId` should return the hexadecimal representation of the provided address', () => {
    // Constants
    const PLUGIN_SETUP_ADDRESS = Address.fromString(ADDRESS_ONE);

    assert.stringEquals(getPluginSetupId(PLUGIN_SETUP_ADDRESS), ADDRESS_ONE);
  });

  test('`getPluginInstallationId` should return a unique ID based on the DAO and plugins address', () => {
    // Constants
    const DAO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_ADDRESS = Address.fromString(ADDRESS_TWO);

    // Generate the pluginInstallationId.
    const pluginInstallationId = getPluginInstallationId(
      DAO_ADDRESS,
      PLUGIN_ADDRESS
    );

    if (pluginInstallationId) {
      const expectedEncodedBytes = Bytes.fromHexString(
        '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      );

      const expectedId = Bytes.fromHexString(
        crypto.keccak256(expectedEncodedBytes).toHexString()
      ).toHexString();

      assert.stringEquals(pluginInstallationId, expectedId);

      // The test is done.
      return;
    }

    // Test should fail if `pluginInstallationId` is null.
    assert.assertTrue(false);
  });

  test('`getPluginPreparationId` should return a concatenated ID string for plugin preparation', () => {
    // Constants
    const DAO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_ADDRESS = Address.fromString(ADDRESS_TWO);

    // Generate the pluginInstallationId.
    const pluginInstallationId = getPluginInstallationId(
      DAO_ADDRESS,
      PLUGIN_ADDRESS
    );

    if (pluginInstallationId) {
      const pluginSetupId = Bytes.fromHexString(DUMMY_BYTES32_HEX);

      // Generate the pluginPreparationId.
      const pluginPreparationId = getPluginPreparationId(
        pluginInstallationId,
        pluginSetupId
      );

      // Expected result
      const expectedPreparationId = `${pluginInstallationId}_${DUMMY_BYTES32_HEX}`;

      assert.stringEquals(pluginPreparationId, expectedPreparationId);

      // test is done.
      return;
    }

    // Test should fail if `pluginInstallationId` is null.
    assert.assertTrue(false);
  });

  test('`getPluginReleaseId` should return an ID string for the plugin release.', () => {
    // Constants
    const PLUGIN_REPO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_RELEASE: i32 = 1;

    // Generate the pluginReleaseId.
    const pluginReleaseId = getPluginReleaseId(
      PLUGIN_REPO_ADDRESS,
      PLUGIN_RELEASE
    );

    const expectedId = `${ADDRESS_ONE}_${PLUGIN_RELEASE}`;

    assert.stringEquals(pluginReleaseId, expectedId);
  });

  test('`getPluginVersionId` should return an ID string for the plugin version.', () => {
    // Constants
    const PLUGIN_REPO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_RELEASE: i32 = 1;
    const PLUGIN_BUILD: i32 = 2;

    // Generate the pluginVersionId.
    const pluginVersionId = getPluginVersionId(
      PLUGIN_REPO_ADDRESS,
      PLUGIN_RELEASE,
      PLUGIN_BUILD
    );

    const expectedId = `${ADDRESS_ONE}_${PLUGIN_RELEASE}_${PLUGIN_BUILD}`;

    assert.stringEquals(pluginVersionId, expectedId);
  });
});
