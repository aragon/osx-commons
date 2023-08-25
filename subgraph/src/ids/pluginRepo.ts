import {
  Address,
  ByteArray,
  Bytes,
  crypto,
  ethereum,
} from '@graphprotocol/graph-ts';
import {getIdFromAddress, getIdFromStringArray} from '../utils/ids';
import {PERMISSION_OPERATIONS} from '../utils/constants';

// PluginRepo
export function getPluginRepoId(pluginRepo: Address): string {
  return getIdFromAddress(pluginRepo);
}

export function getPluginSetupId(pluginSetup: Address): string {
  return getIdFromAddress(pluginSetup);
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
  return getIdFromStringArray([pluginInstallationId, pluginSetupId]);
}

export function getPluginReleaseId(
  pluginRepo: Address,
  release: Number
): string {
  return getIdFromStringArray([
    getPluginRepoId(pluginRepo),
    release.toString(),
  ]);
}

export function getPluginVersionId(
  pluginRepo: Address,
  release: Number,
  build: number
) {
  return getIdFromStringArray([
    getPluginRepoId(pluginRepo),
    release.toString(),
    build.toString(),
  ]);
}

export function getPluginPermissionId(
  pluginPreparationId: string,
  operation: number,
  where: Address,
  who: Address,
  permissionId: Bytes
) {
  const operationId = PERMISSION_OPERATIONS.get(operation);
  const whereId = getIdFromAddress(where);
  const whoId = getIdFromAddress(who);

  return getIdFromStringArray([
    pluginPreparationId,
    operationId,
    whereId,
    whoId,
    permissionId.toHexString(),
  ]);
}
