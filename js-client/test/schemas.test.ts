import {
  AddressOrEnsSchema,
  ApplyInstallationParams,
  ApplyInstallationSchema,
  ApplyUninstallationParams,
  ApplyUninstallationSchema,
  BigintSchema,
  InvalidAddressOrEnsError,
  InvalidCidError,
  InvalidParameter,
  InvalidSubdomainError,
  IpfsUriSchema,
  MultiTargetPermission,
  MultiTargetPermissionSchema,
  Pagination,
  PaginationSchema,
  PermissionIds,
  PermissionOperationType,
  PrepareInstallationParams,
  PrepareInstallationSchema,
  PrepareUninstallationParams,
  PrepareUninstallationSchema,
  SortDirection,
  SubdomainSchema,
  Uint8ArraySchema,
  VersionTagSchema,
} from '../src';
import {
  TEST_ADDRESS,
  TEST_ENS_NAME,
  TEST_INVALID_ADDRESS,
  TEST_INVALID_ENS_NAME,
  TEST_INVALID_IPFS_URI,
  TEST_INVALID_SUBDOMAIN,
  TEST_IPFS_URI_V0,
  TEST_IPFS_URI_V1,
  TEST_SUBDOMAIN,
} from './constants';
import { ValidationError } from 'yup';

describe('Test client schemas', () => {
  describe('Test bigints', () => {
    it('should validate a valid bigint', () => {
      const number = BigInt(1);
      BigintSchema.validateSync(number);
    });
    it('should throw an error if the bigint is TEST_invalid', () => {
      const number = 1;
      expect(() => BigintSchema.validateSync(number)).toThrow(
        new ValidationError(new InvalidParameter('bigint').message)
      );
    });
  });

  describe('Test address or ens', () => {
    it('should validate a valid address', () => {
      const address = TEST_ADDRESS;
      AddressOrEnsSchema.strict().validateSync(address);
    });
    it('should validate a valid ens', () => {
      const ens = TEST_ENS_NAME;
      AddressOrEnsSchema.strict().validateSync(ens);
    });
    it('should throw an error if the address is invalid', () => {
      const address = TEST_INVALID_ADDRESS;
      expect(() => AddressOrEnsSchema.strict().validateSync(address)).toThrow(
        new ValidationError(new InvalidAddressOrEnsError().message)
      );
    });
    it('should throw an error if the ens is invalid', () => {
      const ens = TEST_INVALID_ENS_NAME;
      expect(() => AddressOrEnsSchema.strict().validateSync(ens)).toThrow(
        new ValidationError(new InvalidAddressOrEnsError().message)
      );
    });
  });

  describe('Test version tag', () => {
    it('should validate a valid version tag', () => {
      const versionTag = {
        release: 1,
        build: 1,
      };
      VersionTagSchema.strict().validateSync(versionTag);
    });
    it('should throw an error if the release is invalid', () => {
      const versionTag = {
        release: 0,
        build: 1,
      };
      expect(() => VersionTagSchema.strict().validateSync(versionTag)).toThrow(
        new ValidationError('release must be greater than 0')
      );
    });
    it('should throw an error if the release is invalid', () => {
      const versionTag = {
        release: 1,
        build: 0,
      };
      expect(() => VersionTagSchema.strict().validateSync(versionTag)).toThrow(
        new ValidationError('build must be greater than 0')
      );
    });
    it('should throw an error if the build is missing', () => {
      const versionTag = {
        release: 1,
      };
      expect(() => VersionTagSchema.strict().validateSync(versionTag)).toThrow(
        new ValidationError('build is a required field')
      );
    });
    it('should throw an error if the release is missing', () => {
      const versionTag = {
        build: 1,
      };
      expect(() => VersionTagSchema.strict().validateSync(versionTag)).toThrow(
        new ValidationError('release is a required field')
      );
    });
  });

  test.todo('Abi Schema');

  describe('Test Uint8Array', () => {
    it('should validate a valid Uint8Array', () => {
      const uint8Array = new Uint8Array();
      Uint8ArraySchema.strict().validateSync(uint8Array);
    });
    it('should throw an error if the Uint8Array is invalid', () => {
      const uint8Array: number[] = [];
      expect(() => Uint8ArraySchema.strict().validateSync(uint8Array)).toThrow(
        new ValidationError(new InvalidParameter('Uint8Array').message)
      );
    });
  });

  describe('Test IpfsCid', () => {
    it('should validate a valid v0 ipfs CID', () => {
      const ipfsUri = TEST_IPFS_URI_V0;
      IpfsUriSchema.strict().validateSync(ipfsUri);
    });
    it('should validate a valid v1 ipfs CID', () => {
      const ipfsUri = TEST_IPFS_URI_V1;
      IpfsUriSchema.strict().validateSync(ipfsUri);
    });
    it('should throw an error if the ipfs CID is invalid', () => {
      const ipfsUri = TEST_INVALID_IPFS_URI;
      expect(() => IpfsUriSchema.strict().validateSync(ipfsUri)).toThrow(
        new ValidationError(new InvalidCidError().message)
      );
    });
  });
  describe('Test Subdomain', () => {
    it('should validate a valid subdomain', () => {
      const subdomain = TEST_SUBDOMAIN;
      SubdomainSchema.strict().validateSync(subdomain);
    });
    it('should throw an error if the subdomain is invalid', () => {
      const subdomain = TEST_INVALID_SUBDOMAIN;
      expect(() => SubdomainSchema.strict().validateSync(subdomain)).toThrow(
        new ValidationError(new InvalidSubdomainError().message)
      );
    });
  });

  describe('Test Pagination', () => {
    it('should validate a valid Pagination', () => {
      const pagination: Pagination = {
        skip: 0,
        limit: 1,
        direction: SortDirection.ASC,
      };
      PaginationSchema.strict().validateSync(pagination);
    });
    it('should validate a valid Pagination without optional params', () => {
      const pagination: Pagination = {};
      PaginationSchema.strict().validateSync(pagination);
    });
    it('should throw an error if the skip is invalid', () => {
      const pagination: Pagination = {
        skip: -1,
        limit: 1,
      };
      expect(() => PaginationSchema.strict().validateSync(pagination)).toThrow(
        new ValidationError('skip must be greater than or equal to 0')
      );
    });
    it('should throw an error if the limit is invalid', () => {
      const pagination: Pagination = {
        skip: 0,
        limit: 0,
      };
      expect(() => PaginationSchema.strict().validateSync(pagination)).toThrow(
        new ValidationError('limit must be greater than or equal to 1')
      );
    });
    it('should throw an error if the direction is invalid', () => {
      const pagination = {
        skip: 0,
        limit: 1,
        direction: 'invalid',
      };
      expect(() => PaginationSchema.strict().validateSync(pagination)).toThrow(
        new ValidationError(
          'direction must be one of the following values: asc, desc'
        )
      );
    });
  });

  describe('Test MultiTargetPermission', () => {
    it('should validate a valid MultiTargetPermission', () => {
      const multiTargetPermission: MultiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        where: TEST_ADDRESS,
        who: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
        condition: TEST_ADDRESS,
      };
      MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission);
    });
    it('should validate a valid MultiTargetPermission without optional params', () => {
      const multiTargetPermission: MultiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        where: TEST_ADDRESS,
        who: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission);
    });
    it('should throw an error if the operation is invalid', () => {
      const multiTargetPermission = {
        operation: 3,
        where: TEST_ADDRESS,
        who: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(
        new ValidationError(
          'operation must be one of the following values: 0, 1, 2'
        )
      );
    });
    it('should throw an error if the operation is missing', () => {
      const multiTargetPermission = {
        where: TEST_ADDRESS,
        who: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError('operation is a required field'));
    });
    it('should throw an error if the where is invalid', () => {
      const multiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        where: TEST_INVALID_ADDRESS,
        who: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the who is invalid', () => {
      const multiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        where: TEST_ADDRESS,
        who: TEST_INVALID_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the permissionId is missing', () => {
      const multiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        where: TEST_ADDRESS,
        who: TEST_ADDRESS,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError('permissionId is a required field'));
    });
    it('should throw if the where is missing', () => {
      const multiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        who: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError('where is a required field'));
    });
    it('should throw if the who is missing', () => {
      const multiTargetPermission = {
        operation: PermissionOperationType.GRANT,
        where: TEST_ADDRESS,
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError('who is a required field'));
    });
    it('should throw if the operation is missing', () => {
      const multiTargetPermission = {
        permissionId: PermissionIds.EXECUTE_PERMISSION_ID,
        where: TEST_ADDRESS,
        who: TEST_ADDRESS,
      };
      expect(() =>
        MultiTargetPermissionSchema.strict().validateSync(multiTargetPermission)
      ).toThrow(new ValidationError('operation is a required field'));
    });
  });

  describe('Test PrepareInstallation', () => {
    it('should validate a valid PrepareInstallation', () => {
      const prepareInstallationParams: PrepareInstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        version: {
          release: 1,
          build: 1,
        },
        installationParams: [],
        installationAbi: [],
      };
      PrepareInstallationSchema.strict().validateSync(
        prepareInstallationParams
      );
    });
    it('should validate a valid PrepareInstallation without optional params', () => {
      const prepareInstallationParams: PrepareInstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
      };

      PrepareInstallationSchema.strict().validateSync(
        prepareInstallationParams
      );
    });
    it('should throw an error if the daoAddressOrEns is missing', () => {
      const prepareInstallationParams = {
        pluginRepo: TEST_ADDRESS,
      };
      expect(() =>
        PrepareInstallationSchema.strict().validateSync(
          prepareInstallationParams
        )
      ).toThrow(new ValidationError('daoAddressOrEns is a required field'));
    });
    it('should throw an error if the pluginRepo is missing', () => {
      const prepareInstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
      };
      expect(() =>
        PrepareInstallationSchema.strict().validateSync(
          prepareInstallationParams
        )
      ).toThrow(new ValidationError('pluginRepo is a required field'));
    });
    it('should throw an error if the daoAddressOrEns is invalid', () => {
      const prepareInstallationParams: PrepareInstallationParams = {
        daoAddressOrEns: TEST_INVALID_ADDRESS,
        pluginRepo: TEST_ADDRESS,
      };
      expect(() =>
        PrepareInstallationSchema.strict().validateSync(
          prepareInstallationParams
        )
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the pluginRepo is invalid', () => {
      const prepareInstallationParams: PrepareInstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginRepo: TEST_INVALID_ADDRESS,
      };
      expect(() =>
        PrepareInstallationSchema.strict().validateSync(
          prepareInstallationParams
        )
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
  });
  describe('Test PrepareUninstallation', () => {
    it('should validate a valid PrepareUninstallation', () => {
      const prepareUninstallationParams: PrepareUninstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginAddress: TEST_ADDRESS,
        pluginInstallationIndex: 0,
        uninstallationAbi: [],
        uninstallationParams: [],
      };
      PrepareUninstallationSchema.strict().validateSync(
        prepareUninstallationParams
      );
    });
    it('should validate a valid PrepareUninstallation without optional params', () => {
      const prepareUninstallationParams: PrepareUninstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginAddress: TEST_ADDRESS,
        pluginInstallationIndex: 0,
      };
      PrepareUninstallationSchema.strict().validateSync(
        prepareUninstallationParams
      );
    });
    it('should throw an error if the daoAddressOrEns is missing', () => {
      const prepareUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
      };
      expect(() =>
        PrepareUninstallationSchema.strict().validateSync(
          prepareUninstallationParams
        )
      ).toThrow(new ValidationError('daoAddressOrEns is a required field'));
    });
    it('should throw an error if the pluginAddress is missing', () => {
      const prepareUninstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
      };
      expect(() =>
        PrepareUninstallationSchema.strict().validateSync(
          prepareUninstallationParams
        )
      ).toThrow(new ValidationError('pluginAddress is a required field'));
    });
    it('should throw an error if the pluginInstallationIndex is invalid', () => {
      const prepareUninstallationParams: PrepareUninstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginAddress: TEST_ADDRESS,
        pluginInstallationIndex: -1,
      };
      expect(() =>
        PrepareUninstallationSchema.strict().validateSync(
          prepareUninstallationParams
        )
      ).toThrow(
        new ValidationError(
          'pluginInstallationIndex must be greater than or equal to 0'
        )
      );
    });
    it('should throw an error if the daoAddressOrEns is invalid', () => {
      const prepareUninstallationParams: PrepareUninstallationParams = {
        daoAddressOrEns: TEST_INVALID_ADDRESS,
        pluginAddress: TEST_ADDRESS,
        pluginInstallationIndex: 0,
      };
      expect(() =>
        PrepareUninstallationSchema.strict().validateSync(
          prepareUninstallationParams
        )
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the pluginAddress is invalid', () => {
      const prepareUninstallationParams: PrepareUninstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginAddress: TEST_INVALID_ADDRESS,
        pluginInstallationIndex: 0,
      };
      expect(() =>
        PrepareUninstallationSchema.strict().validateSync(
          prepareUninstallationParams
        )
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the uninstallationParams is invalid', () => {
      const prepareUninstallationParams = {
        daoAddressOrEns: TEST_ADDRESS,
        pluginAddress: TEST_ADDRESS,
        uninstallationParams: {},
      };
      expect(() =>
        PrepareUninstallationSchema.strict().validateSync(
          prepareUninstallationParams
        )
      ).toThrow(
        new ValidationError(
          'uninstallationParams must be a `array` type, but the final value was: `{}`.'
        )
      );
    });
    test.todo('should throw an error if the uninstallationAbi is invalid');
  });
  describe('Test ApplyUninstallation', () => {
    it('should validate a valid ApplyUninstallation', () => {
      const applyUninstallationParams: ApplyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
      };
      ApplyUninstallationSchema.strict().validateSync(
        applyUninstallationParams
      );
    });
    it('should throw an error if the pluginAddress is missing', () => {
      const applyUninstallationParams = {
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError('pluginAddress is a required field'));
    });
    it('should throw an error if the pluginRepo is missing', () => {
      const applyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError('pluginRepo is a required field'));
    });
    it('should throw an error if the versionTag is missing', () => {
      const applyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        permissions: [],
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError('versionTag is a required field'));
    });
    it('should throw an error if the permissions is missing', () => {
      const applyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError('permissions is a required field'));
    });
    it('should throw an error if the pluginAddress is invalid', () => {
      const applyUninstallationParams: ApplyUninstallationParams = {
        pluginAddress: TEST_INVALID_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the pluginRepo is invalid', () => {
      const applyUninstallationParams: ApplyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_INVALID_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the versionTag is invalid', () => {
      const applyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 0,
          release: 1,
        },
        permissions: [],
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(new ValidationError('versionTag.build must be greater than 0'));
    });
    it('should throw an error if the permissions is invalid', () => {
      const applyUninstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: {},
      };
      expect(() =>
        ApplyUninstallationSchema.strict().validateSync(
          applyUninstallationParams
        )
      ).toThrow(
        new ValidationError(
          'permissions must be a `array` type, but the final value was: `{}`.'
        )
      );
    });
  });
  describe('Test ApplyInstallation', () => {
    it('should validate a valid ApplyInstallation', () => {
      const applyInstallationParams: ApplyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
        helpers: [],
      };
      ApplyInstallationSchema.strict().validateSync(applyInstallationParams);
    });
    it('should throw an error if the pluginAddress is missing', () => {
      const applyInstallationParams = {
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError('pluginAddress is a required field'));
    });
    it('should throw an error if the pluginRepo is missing', () => {
      const applyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError('pluginRepo is a required field'));
    });
    it('should throw an error if the versionTag is missing', () => {
      const applyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        permissions: [],
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError('versionTag is a required field'));
    });
    it('should throw an error if the permissions is missing', () => {
      const applyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError('permissions is a required field'));
    });
    it('should throw an error if the helpers is missing', () => {
      const applyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError('helpers is a required field'));
    });
    it('should throw an error if the pluginAddress is invalid', () => {
      const applyInstallationParams: ApplyInstallationParams = {
        pluginAddress: TEST_INVALID_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the pluginRepo is invalid', () => {
      const applyInstallationParams: ApplyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_INVALID_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(new ValidationError(new InvalidAddressOrEnsError().message));
    });
    it('should throw an error if the permissions is invalid', () => {
      const applyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: {},
        helpers: [],
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(
        new ValidationError(
          'permissions must be a `array` type, but the final value was: `{}`.'
        )
      );
    });
    it('should throw an error if the helpers is invalid', () => {
      const applyInstallationParams = {
        pluginAddress: TEST_ADDRESS,
        pluginRepo: TEST_ADDRESS,
        versionTag: {
          build: 1,
          release: 1,
        },
        permissions: [],
        helpers: {},
      };
      expect(() =>
        ApplyInstallationSchema.strict().validateSync(applyInstallationParams)
      ).toThrow(
        new ValidationError(
          'helpers must be a `array` type, but the final value was: `{}`.'
        )
      );
    });
  });
});
