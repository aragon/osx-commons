export function mockContractProtocolVersion(
  version: [number, number, number] = [1, 0, 0],
  throwException: boolean = false
) {
  jest
    .spyOn(require('@ethersproject/contracts'), 'Contract')
    .mockImplementation(() => {
      return {
        protocolVersion: () => {
          if (throwException) {
            throw new Error('Error');
          }
          return Promise.resolve(version);
        },
      };
    });
}

export function mockJSONRPCProvider(
  chainId: number = 1,
  blockNumber: number = 1
) {
  return jest
    .spyOn(require('@ethersproject/providers'), 'JsonRpcProvider')
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
