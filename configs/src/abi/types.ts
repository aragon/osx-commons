import {SupportedVersions} from '../deployments';

export type Abi = {
  [version in SupportedVersions]: {
    [contractName in ContractAbiNames]: object;
  };
};

export enum ContractAbiNames {
  DAO = 'DAO',
  DAOFactory = 'DAOFactory',
}
