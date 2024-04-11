/**
 * Contains the supported plugin types
 */
export enum PluginType {
  UUPS = 0,
  Cloneable = 1,
  Constructable = 2,
}

/**
 * Contains the payload passed to governance contracts, serializing
 * the actions to do upon approval
 */

export type MetadataAbiInput = {
  name: string;
  type: string;
  internalType: string;
  description: string;
  components?: MetadataAbiInput[];
};

export type VersionTag = {
  build: number;
  release: number;
};

export enum PermissionOperationType {
  GRANT = 0,
  REVOKE = 1,
  GRANT_WITH_CONDITION = 2,
}

export type SingleTargetPermission = {
  operation: PermissionOperationType;
  who: string;
  permissionId: string;
};

export type MultiTargetPermission = {
  operation: PermissionOperationType;
  where: string;
  who: string;
  condition?: string;
  permissionId: string;
};
