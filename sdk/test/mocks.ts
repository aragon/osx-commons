import {FunctionFragment} from '@ethersproject/abi';
import {ErrorCode, Logger} from '@ethersproject/logger';

export function mockContractProtocolVersion(
  version: [number, number, number] = [1, 0, 0],
  throwException: boolean = false
) {
  jest
    .spyOn(jest.requireActual('@ethersproject/contracts'), 'Contract')
    .mockImplementation(() => {
      return {
        protocolVersion: () => {
          if (throwException) {
            const logger = new Logger('5.7.0');
            logger.throwError(
              'Protocol version not found',
              ErrorCode.INVALID_ARGUMENT
            );
          }
          return Promise.resolve(version);
        },
        interface: {
          getFunction: (name: string): FunctionFragment => {
            return FunctionFragment.from({
              name: name,
              type: 'function',
              stateMutability: 'pure',
            });
          },
        },
      };
    });
}

export function mockJSONRPCProvider(
  chainId: number = 1,
  blockNumber: number = 1
) {
  return jest
    .spyOn(jest.requireActual('@ethersproject/providers'), 'JsonRpcProvider')
    .mockImplementation(() => {
      return {
        getNetwork: () => {
          return {
            chainId,
          };
        },
        getBlockNumber: () => {
          return Promise.resolve(blockNumber);
        },
      };
    });
}
