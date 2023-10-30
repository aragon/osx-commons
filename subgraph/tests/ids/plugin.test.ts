import {
  generatePluginRepoEntityId,
  generatePluginSetupEntityId,
  generatePluginInstallationEntityId,
  generatePluginPreparationEntityId,
  generatePluginReleaseEntityId,
  generatePluginVersionEntityId,
  generatePluginEntityId,
} from '../../src';
import {ADDRESS_ONE, ADDRESS_TWO, DUMMY_BYTES32_HEX} from '../constants';
import {Address, Bytes, crypto} from '@graphprotocol/graph-ts';
import {assert, describe, test} from 'matchstick-as/assembly/index';

describe('Plugin ID generation', () => {
  test('`generatePluginEntityId` should return the hex string representation of the plugin address', () => {
    const pluginAddress = Address.fromString(ADDRESS_ONE);
    const expectedId = pluginAddress.toHexString();

    assert.stringEquals(generatePluginEntityId(pluginAddress), expectedId);
  });
  test('`generatePluginRepoEntityId` should return the hexadecimal representation of the provided address', () => {
    // Constants
    const PLUGIN_REPO_ADDRESS = Address.fromString(ADDRESS_ONE);

    assert.stringEquals(
      generatePluginRepoEntityId(PLUGIN_REPO_ADDRESS),
      ADDRESS_ONE
    );
  });

  test('`generatePluginSetupEntityId` should return the hexadecimal representation of the provided address', () => {
    // Constants
    const PLUGIN_SETUP_ADDRESS = Address.fromString(ADDRESS_ONE);

    assert.stringEquals(
      generatePluginSetupEntityId(PLUGIN_SETUP_ADDRESS),
      ADDRESS_ONE
    );
  });

  test('`generatePluginInstallationEntityId` should return a unique ID based on the DAO and plugins address', () => {
    // Constants
    const DAO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_ADDRESS = Address.fromString(ADDRESS_TWO);

    // Generate the pluginInstallationEntityId.
    const pluginInstallationEntityId = generatePluginInstallationEntityId(
      DAO_ADDRESS,
      PLUGIN_ADDRESS
    );

    if (pluginInstallationEntityId) {
      const expectedEncodedBytes = Bytes.fromHexString(
        '0x00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002'
      );

      const expectedId = Bytes.fromHexString(
        crypto.keccak256(expectedEncodedBytes).toHexString()
      ).toHexString();

      assert.stringEquals(pluginInstallationEntityId, expectedId);

      // The test is done.
      return;
    }

    // Test should fail if `pluginInstallationEntityId` is null.
    assert.assertTrue(false);
  });

  test('`generatePluginPreparationId` should return a concatenated ID string for plugin preparation', () => {
    // Constants
    const DAO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_ADDRESS = Address.fromString(ADDRESS_TWO);

    // Generate the pluginInstallationEntityId.
    const pluginInstallationEntityId = generatePluginInstallationEntityId(
      DAO_ADDRESS,
      PLUGIN_ADDRESS
    );

    if (pluginInstallationEntityId) {
      const pluginSetupId = Bytes.fromHexString(DUMMY_BYTES32_HEX);

      // Generate the pluginPreparationEntityId.
      const pluginPreparationEntityId = generatePluginPreparationEntityId(
        pluginInstallationEntityId,
        pluginSetupId
      );

      // Expected result
      const expectedPreparationId = `${pluginInstallationEntityId}_${DUMMY_BYTES32_HEX}`;

      assert.stringEquals(pluginPreparationEntityId, expectedPreparationId);

      // test is done.
      return;
    }

    // Test should fail if `pluginInstallationEntityId` is null.
    assert.assertTrue(false);
  });

  test('`generatePluginReleaseEntityId` should return an ID string for the plugin release.', () => {
    // Constants
    const PLUGIN_REPO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_RELEASE: i32 = 1;

    // Generate the pluginReleaseEntityId.
    const pluginReleaseEntityId = generatePluginReleaseEntityId(
      PLUGIN_REPO_ADDRESS,
      PLUGIN_RELEASE
    );

    const expectedId = `${ADDRESS_ONE}_${PLUGIN_RELEASE}`;

    assert.stringEquals(pluginReleaseEntityId, expectedId);
  });

  test('`generatePluginVersionEntityId` should return an ID string for the plugin version.', () => {
    // Constants
    const PLUGIN_REPO_ADDRESS = Address.fromString(ADDRESS_ONE);
    const PLUGIN_RELEASE: i32 = 1;
    const PLUGIN_BUILD: i32 = 2;

    // Generate the pluginVersionEntityId.
    const pluginVersionEntityId = generatePluginVersionEntityId(
      PLUGIN_REPO_ADDRESS,
      PLUGIN_RELEASE,
      PLUGIN_BUILD
    );

    const expectedId = `${ADDRESS_ONE}_${PLUGIN_RELEASE}_${PLUGIN_BUILD}`;

    assert.stringEquals(pluginVersionEntityId, expectedId);
  });
});
