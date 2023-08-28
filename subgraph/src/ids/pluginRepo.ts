import {
  Address,
  ByteArray,
  Bytes,
  crypto,
  ethereum,
} from '@graphprotocol/graph-ts';
import {PERMISSION_OPERATIONS} from '../utils/constants';

// PluginRepo
export function getPluginRepoId(pluginRepo: Address): string {
  return pluginRepo.toHexString();
}

export function getPluginSetupId(pluginSetup: Address): string {
  return pluginSetup.toHexString();
}

export function getPluginInstallationId(
  dao: Address,
  plugin: Address
): Bytes | null {
  let installationIdTupleArray = new ethereum.Tuple();
  installationIdTupleArray.push(ethereum.Value.fromAddress(dao));
  installationIdTupleArray.push(ethereum.Value.fromAddress(plugin));

  let installationIdTuple = installationIdTupleArray as ethereum.Tuple;
  let installationIdTupleEncoded = ethereum.encode(
    ethereum.Value.fromTuple(installationIdTuple)
  );

  if (installationIdTupleEncoded) {
    return Bytes.fromHexString(
      crypto
        .keccak256(
          ByteArray.fromHexString(installationIdTupleEncoded.toHexString())
        )
        .toHexString()
    );
  }
  return null;
}

export function getPluginPreparationId(
  pluginInstallationId: string,
  pluginSetupId: string
): string {
  const ids = [pluginInstallationId, pluginSetupId];
  return ids.join('_');
}

export function getPluginReleaseId(
  pluginRepo: Address,
  release: Number
): string {
  const ids = [getPluginRepoId(pluginRepo), release.toString()];
  return ids.join('_');
}

export function getPluginVersionId(
  pluginRepo: Address,
  release: Number,
  build: number
) {
  const ids = [
    getPluginRepoId(pluginRepo),
    release.toString(),
    build.toString(),
  ];
  return ids.join('_');
}

export function getPluginPermissionId(
  pluginPreparationId: string,
  operation: number,
  where: Address,
  who: Address,
  permissionId: Bytes
) {
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
