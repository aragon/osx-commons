import {PERMISSION_OPERATIONS} from '../utils/constants';
import {
  Address,
  ByteArray,
  Bytes,
  crypto,
  ethereum,
} from '@graphprotocol/graph-ts';

/**
 * Generates the plugin repository's ID using its address in hexadecimal format.
 *
 * @param pluginRepo - The address of the plugin repository.
 * @returns A hexadecimal string representation of the provided address.
 */
export function getPluginRepoId(pluginRepo: Address): string {
  return pluginRepo.toHexString();
}

/**
 * Generates the plugin setup's ID using its address in hexadecimal format.
 *
 * @param pluginSetup - The address of the plugin setup.
 * @returns A hexadecimal string representation of the provided address.
 */
export function getPluginSetupId(pluginSetup: Address): string {
  return pluginSetup.toHexString();
}

/**
 * Generates an installation ID for a plugin based on a DAO and plugin's address.
 *
 * @param dao - The address of the DAO.
 * @param plugin - The address of the plugin.
 * @returns A unique ID based on the DAO and plugin's address or null if the encoding fails.
 */
export function getPluginInstallationId(
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
    return Bytes.fromHexString(
      crypto
        .keccak256(
          ByteArray.fromHexString(installationIdTupleEncoded.toHexString())
        )
        .toHexString()
    ).toHexString();
  }
  return null;
}

/**
 * Generates a preparation ID by merging plugin installation ID and plugin setup ID.
 *
 * @param pluginInstallationId - The installation ID of the plugin.
 * @param pluginSetupId - The preparedSetupId of the plugin emitted from `PluginSetupProcessor`.
 *                         Refer to the [PluginSetupProcessor contract](https://github.com/aragon/osx/blob/develop/packages/contracts/src/framework/plugin/setup/PluginSetupProcessorHelpers.sol) for more details.
 * @returns A concatenated ID string for plugin preparation.
 */
export function getPluginPreparationId(
  pluginInstallationId: string,
  prepareSetupId: Bytes
): string {
  const ids = [pluginInstallationId, prepareSetupId.toHexString()];
  return ids.join('_');
}

/**
 * Generates a unique ID for a plugin's release based on its repository and release number.
 *
 * @param pluginRepo - The address of the plugin repository.
 * @param release - The number corresponding to the plugin's release.
 * @returns An ID string for the plugin release.
 */
export function getPluginReleaseId(pluginRepo: Address, release: i32): string {
  const ids = [getPluginRepoId(pluginRepo), release.toString()];
  return ids.join('_');
}

/**
 * Generates a unique ID for a plugin's version using its repository, release number, and build number.
 *
 * @param pluginRepo - The address of the plugin repository.
 * @param release - The release number of the plugin.
 * @param build - The build number for the specific version of the plugin.
 * @returns A unique ID string for the plugin version.
 */
export function getPluginVersionId(
  pluginRepo: Address,
  release: i32,
  build: i32
): string {
  const ids = [
    getPluginRepoId(pluginRepo),
    release.toString(),
    build.toString(),
  ];
  return ids.join('_');
}

/**
 * Generates a unique permission ID for a plugin based on multiple attributes including operation, addresses, and existing permission ID.
 *
 * @param pluginPreparationId - The ID from plugin preparation.
 * @param operation - The numerical code for the operation type.
 * @param where - The address specifying the location of the permission.
 * @param who - The address specifying the entity of the permission.
 * @param permissionId - An existing permission ID.
 * @returns A concatenated unique ID string for the plugin permission.
 */
export function getPluginPermissionId(
  pluginPreparationId: string,
  operation: i32,
  where: Address,
  who: Address,
  permissionId: Bytes
): string {
  const operationId = PERMISSION_OPERATIONS.get(operation);
  const ids = [
    pluginPreparationId,
    operationId,
    where.toHexString(),
    who.toHexString(),
    permissionId.toHexString(),
  ];

  return ids.join('_');
}
