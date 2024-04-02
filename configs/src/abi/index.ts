import {SupportedVersions} from '../deployments';
import {Abi, ContractAbiNames} from './types';
import {DAO as DAO_v1_0_0, DAOFactory as DAOFactory_v1_0_0} from './v1.0.0';
import {DAO as DAO_v1_3_0, DAOFactory as DAOFactory_v1_3_0} from './v1.3.0';

export const abi: Abi = {
  [SupportedVersions.V1_0_0]: {
    [ContractAbiNames.DAO]: DAO_v1_0_0,
    [ContractAbiNames.DAOFactory]: DAOFactory_v1_0_0,
  },
  [SupportedVersions.V1_3_0]: {
    [ContractAbiNames.DAO]: DAO_v1_3_0,
    [ContractAbiNames.DAOFactory]: DAOFactory_v1_3_0,
  },
};
