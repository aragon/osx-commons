import {
  InvalidAddressOrEnsError,
  InvalidCidError,
  InvalidContractAbiError,
  InvalidParameter,
  InvalidSubdomainError,
} from './errors';
import { ANY_ADDRESS } from './internal/constants';
import { isEnsName, isIpfsUri, isSubdomain } from './validation';
import { isAddress } from '@ethersproject/address';
import { array, mixed, number, object, string } from 'yup';

export const BigintSchema = mixed().test(
  'isBigint',
  new InvalidParameter('bigint').message,
  (value) => typeof value === 'bigint'
);
export const AddressOrEnsSchema = string()
  .notRequired()
  .test('isAddressOrEns', new InvalidAddressOrEnsError().message, (value) =>
    value ? isAddress(value) || isEnsName(value) : true
  );
export const AddressOrEnsWithoutAnySchema = string()
  .notRequired()
  .test(
    'isAddressOrEnsWithoutAny',
    new InvalidAddressOrEnsError().message,
    (value) =>
      value
        ? (isAddress(value) || isEnsName(value)) && value !== ANY_ADDRESS
        : true
  );
export const VersionTagSchema = object({
  build: number().moreThan(0).required(),
  release: number().moreThan(0).required(),
});
export const AbiSchema = array()
  .notRequired()
  .test(
    'isValidAbi',
    new InvalidContractAbiError().message,
    // TODO: validate abi
    () => true
  );
export const Uint8ArraySchema = mixed().test(
  'isUint8Array',
  new InvalidParameter('Uint8Array').message,
  (value) => (value ? value instanceof Uint8Array : true)
);
export const IpfsUriSchema = string().test(
  'isIpfsUri',
  new InvalidCidError().message,
  (value) => (value ? isIpfsUri(value) : true)
);
export const SubdomainSchema = string().test(
  'isSubdomain',
  new InvalidSubdomainError().message,
  (value) => (value ? isSubdomain(value) : true)
);

export const PaginationSchema = object({
  skip: number().min(0).notRequired(),
  limit: number().min(1).notRequired(),
  direction: string().oneOf(['asc', 'desc']).notRequired(),
});

export const PrepareUninstallationSchema = object({
  daoAddressOrEns: AddressOrEnsSchema.required(),
  pluginAddress: AddressOrEnsSchema.required(),
  pluginInstallationIndex: number().notRequired().min(0),
  uninstallationParams: array().notRequired(),
  uninstallationAbi: AbiSchema.notRequired(),
});
export const MultiTargetPermissionSchema = object({
  operation: number().required().oneOf([0, 1, 2]),
  permissionId: string().required(),
  where: AddressOrEnsWithoutAnySchema.required(),
  who: AddressOrEnsWithoutAnySchema.required(),
  condition: string().notRequired(),
});

export const PrepareInstallationSchema = object({
  daoAddressOrEns: AddressOrEnsSchema.required(),
  pluginRepo: AddressOrEnsSchema.required(),
  version: VersionTagSchema.notRequired(),
  installationParams: array().notRequired(),
  installationAbi: AbiSchema.notRequired(),
});

export const PluginInstallItemSchema = object({
  id: AddressOrEnsSchema.required(),
  data: Uint8ArraySchema.required(),
});

export const ApplyUninstallationSchema = object({
  pluginAddress: AddressOrEnsSchema.required(),
  pluginRepo: AddressOrEnsSchema.required(),
  versionTag: VersionTagSchema.required(),
  permissions: array(MultiTargetPermissionSchema).required(),
});

export const ApplyInstallationSchema = ApplyUninstallationSchema.concat(
  object({
    helpers: array(AddressOrEnsSchema).required(),
  })
);
