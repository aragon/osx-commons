import {generateEntityIdFromAddress, generateEntityIdFromBytes} from './ids';
import {
  Address,
  ByteArray,
  Bytes,
  crypto,
  ethereum,
} from '@graphprotocol/graph-ts';

/**
 * Generates an entity ID for a plugin.
 * @param plugin - The address of the plugin.
 * @returns The entity ID as a string.
 */
export function generatePluginEntityId(plugin: Address): string {
  return generateEntityIdFromAddress(plugin);
}

/**
 * Generates the plugin repository's ID using its address in hexadecimal format.
 *
 * @param pluginRepo - The address of the plugin repository.
 * @returns A hexadecimal string representation of the provided address.
 */
export function generatePluginRepoEntityId(pluginRepo: Address): string {
  return generateEntityIdFromAddress(pluginRepo);
}

/**
 * Generates the plugin setup's ID using its address in hexadecimal format.
 *
 * @param pluginSetup - The address of the plugin setup.
 * @returns A hexadecimal string representation of the provided address.
 */
export function generatePluginSetupEntityId(pluginSetup: Address): string {
  return generateEntityIdFromAddress(pluginSetup);
}

/**
 * Generates an installation ID for a plugin based on a DAO and plugin's address.
 *
 * @param dao - The address of the DAO.
 * @param plugin - The address of the plugin.
 * @returns A unique ID based on the DAO and plugin's address or null if the encoding fails.
 */
export function generatePluginInstallationEntityId(
  dao: Address,
  plugin: Address
): string | null {
  const installationIdTuple = new ethereum.Tuple();
  installationIdTuple.push(ethereum.Value.fromAddress(dao));
  installationIdTuple.push(ethereum.Value.fromAddress(plugin));

  const installationIdTupleEncoded = ethereum.encode(
    ethereum.Value.fromTuple(installationIdTuple)
  );

  if (installationIdTupleEncoded) {
    return generateEntityIdFromBytes(
      Bytes.fromHexString(
        crypto
          .keccak256(
            ByteArray.fromHexString(installationIdTupleEncoded.toHexString())
          )
          .toHexString()
      )
    );
  }
  return null;
}

/**
 * Generates a preparation ID by merging plugin installation ID and plugin setup ID.
 *
 * @param pluginInstallationEntityId - The installation ID of the plugin.
 * @param pluginSetupId - The preparedSetupId of the plugin emitted from `PluginSetupProcessor`.
 *                         Refer to the [PluginSetupProcessor contract](https://github.com/aragon/osx/blob/develop/packages/contracts/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol) for more details.
 * @returns A concatenated ID string for plugin preparation.
 */
export function generatePluginPreparationEntityId(
  pluginInstallationEntityId: string,
  prepareSetupId: Bytes
): string {
  return [
    pluginInstallationEntityId,
    generateEntityIdFromBytes(prepareSetupId),
  ].join('_');
}

/**
 * Generates a unique ID for a plugin's release based on its repository and release number.
 *
 * @param pluginRepo - The address of the plugin repository.
 * @param release - The number corresponding to the plugin's release.
 * @returns An ID string for the plugin release.
 */
export function generatePluginReleaseEntityId(
  pluginRepo: Address,
  release: i32
): string {
  return [generatePluginRepoEntityId(pluginRepo), release.toString()].join('_');
}

/**
 * Generates a unique ID for a plugin's version using its repository, release number, and build number.
 *
 * @param pluginRepo - The address of the plugin repository.
 * @param release - The release number of the plugin.
 * @param build - The build number for the specific version of the plugin.
 * @returns A unique ID string for the plugin version.
 */
export function generatePluginVersionEntityId(
  pluginRepo: Address,
  release: i32,
  build: i32
): string {
  return [
    generatePluginRepoEntityId(pluginRepo),
    release.toString(),
    build.toString(),
  ].join('_');
}
