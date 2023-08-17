import {Address} from '@graphprotocol/graph-ts';
import {getIdFromAddress, getIdFromStringArray} from '../utils';

// DAO
export function getDaoId(dao: Address): string {
  return getIdFromAddress(dao);
}

// PluginRepo
export function getPluginRepoId(pluginRepo: Address): string {
  return getIdFromAddress(pluginRepo);
}

export function getPluginSetupId(pluginSetup: Address): string {
  return getIdFromAddress(pluginSetup);
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
