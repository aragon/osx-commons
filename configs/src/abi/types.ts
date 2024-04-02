import { SupportedVersions } from "../deployments"

export type Abi = {
    [version in SupportedVersions]: {
        [contractName in ContractAbiNames]: Object;
    }
}

export enum ContractAbiNames {
    DAO = "DAO",
    DAOFactory = "DAOFactory",
}