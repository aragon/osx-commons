import {id} from '@ethersproject/hash';

/**
 * Enum for PermissionType
 * Reference: https://github.com/aragon/osx-commons/blob/ffa6b45fab9ec067d4bed3b81f5097f03861b876/contracts/src/permission/PermissionLib.sol
 *
 * @export
 * @enum {number}
 */
export enum Operation {
  Grant = 0,
  Revoke = 1,
  GrantWithCondition = 2,
}

export const PERMISSION_MANAGER_FLAGS = {
  UNSET_FLAG: `0x${'0'.repeat(40)}`, // address(0)
  ALLOW_FLAG: `0x${'0'.repeat(39)}2`, // address(2)
  ANY_ADDR: `0x${'f'.repeat(40)}`, // address(-1)
  NO_CONDITION: `0x${'0'.repeat(40)}`, // address(0)
};

/**
 * Permission IDs for ENS registrar
 * Reference: https://github.com/aragon/osx/blob/736187bed3302fb56fadd04f091a5f68ae134518/packages/contracts/src/framework/utils/ens/ENSSubdomainRegistrar.sol
 */
export const ENS_REGISTRAR_PERMISSIONS = {
  UPGRADE_REGISTRAR_PERMISSION_ID: id('UPGRADE_REGISTRAR_PERMISSION'),
  REGISTER_ENS_SUBDOMAIN_PERMISSION_ID: id('REGISTER_ENS_SUBDOMAIN_PERMISSION'),
};

/**
 * Permission IDs for DAO registry
 * Reference: https://github.com/aragon/osx/blob/736187bed3302fb56fadd04f091a5f68ae134518/packages/contracts/src/framework/dao/DAORegistry.sol
 */
export const DAO_REGISTRY_PERMISSIONS = {
  UPGRADE_REGISTRY_PERMISSION_ID: id('UPGRADE_REGISTRY_PERMISSION'),
  REGISTER_DAO_PERMISSION_ID: id('REGISTER_DAO_PERMISSION'),
  ENS_REGISTRAR_PERMISSIONS,
};

/**
 * Permission IDs for DAO
 * Reference: https://github.com/aragon/osx/blob/736187bed3302fb56fadd04f091a5f68ae134518/packages/contracts/src/core/dao/DAO.sol
 */
export const DAO_PERMISSIONS = {
  ROOT_PERMISSION_ID: id('ROOT_PERMISSION'),
  EXECUTE_PERMISSION_ID: id('EXECUTE_PERMISSION'),
  UPGRADE_DAO_PERMISSION_ID: id('UPGRADE_DAO_PERMISSION'),
  SET_SIGNATURE_VALIDATOR_PERMISSION_ID: id(
    'SET_SIGNATURE_VALIDATOR_PERMISSION'
  ),
  SET_TRUSTED_FORWARDER_PERMISSION_ID: id('SET_TRUSTED_FORWARDER_PERMISSION'),
  SET_METADATA_PERMISSION_ID: id('SET_METADATA_PERMISSION'),
  REGISTER_STANDARD_CALLBACK_PERMISSION_ID: id(
    'REGISTER_STANDARD_CALLBACK_PERMISSION'
  ),
  VALIDATE_SIGNATURE_PERMISSION_ID: id('VALIDATE_SIGNATURE_PERMISSION'),
};

/**
 * Permission IDs for Plugin registry
 * Reference: https://github.com/aragon/osx/blob/736187bed3302fb56fadd04f091a5f68ae134518/packages/contracts/test/framework/plugin/plugin-repo-registry.ts
 */
export const PLUGIN_REGISTRY_PERMISSIONS = {
  UPGRADE_REGISTRY_PERMISSION_ID: id('UPGRADE_REGISTRY_PERMISSION'),
  REGISTER_PLUGIN_REPO_PERMISSION_ID: id('REGISTER_PLUGIN_REPO_PERMISSION'),
  ENS_REGISTRAR_PERMISSIONS,
};

/**
 * Permission IDs for Plugin UUPS upgradeable
 */
export const PLUGIN_UUPS_UPGRADEABLE_PERMISSIONS = {
  UPGRADE_PLUGIN_PERMISSION_ID: id('UPGRADE_PLUGIN_PERMISSION'),
};

/**
 * Permission IDs for plugin repo
 * Reference: https://github.com/aragon/osx/blob/736187bed3302fb56fadd04f091a5f68ae134518/packages/contracts/src/framework/plugin/repo/PluginRepo.sol
 */
export const PLUGIN_REPO_PERMISSIONS = {
  ROOT_PERMISSION_ID: id('ROOT_PERMISSION'),
  MAINTAINER_PERMISSION_ID: id('MAINTAINER_PERMISSION'),
  UPGRADE_REPO_PERMISSION_ID: id('UPGRADE_REPO_PERMISSION'),
};

/**
 * Permission IDs for Plugin setup processor
 * Reference: https://github.com/aragon/osx/blob/736187bed3302fb56fadd04f091a5f68ae134518/packages/contracts/src/framework/plugin/setup/PluginSetupProcessor.sol
 */
export const PLUGIN_SETUP_PROCESSOR_PERMISSIONS = {
  APPLY_INSTALLATION_PERMISSION_ID: id('APPLY_INSTALLATION_PERMISSION'),
  APPLY_UPDATE_PERMISSION_ID: id('APPLY_UPDATE_PERMISSION'),
  APPLY_UNINSTALLATION_PERMISSION_ID: id('APPLY_UNINSTALLATION_PERMISSION'),
};
