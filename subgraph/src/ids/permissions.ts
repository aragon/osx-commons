import {Address, Bytes} from '@graphprotocol/graph-ts';
import {PERMISSION_OPERATIONS} from '../utils/constants';

/**
 * Generates the ContractPermissionId ID using the given parameters.
 *
 * @param where - The address of the target contract for which a permission is granted.
 * @param permissionId - The permission identifier.
 * @returns A concatenated ID string for ContractPermissionId entity.
 */
export function getContractPermissionId(
  where: Address,
  permissionId: Bytes
): string {
  const ids = [where.toHexString(), permissionId.toHexString()];
  return ids.join('_');
}

/**
 * Generates a unique permission ID using the given parameters.
 *
 * @param where - The address of the target contract for which a permission is granted.
 * @param permissionId - The permission identifier in byte format.
 * @param who - The address of the entity to which the permission is granted.
 * @returns A concatenated ID string for the Permission entity.
 */
export function getPermissionId(
  where: Address,
  permissionId: Bytes,
  who: Address
): string {
  const ids = [
    where.toHexString(),
    permissionId.toHexString(),
    who.toHexString()
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
    permissionId.toHexString()
  ];

  return ids.join('_');
}
