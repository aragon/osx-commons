import {
  IMPLICIT_INITIAL_PROTOCOL_VERSION,
  getInterfaceId,
  getProtocolVersion,
} from '../../src';
import {ADDRESS_ONE, TEST_HTTP_URI} from '../constants';
import {mockJSONRPCProvider, mockContractProtocolVersion} from '../mocks';
import {Interface} from '@ethersproject/abi';
import {Contract} from '@ethersproject/contracts';
import {JsonRpcProvider} from '@ethersproject/providers';

describe('introspection', () => {
  describe('getInterfaceId', () => {
    it('should return the correct interfaceId', () => {
      const iface = new Interface([
        'function foo()',
        'function bar()',
        'function baz()',
      ]);
      const interfaceId = getInterfaceId(iface);
      expect(interfaceId).toEqual('0x9bb235aa');
    });
  });

  describe('getProtocolVersion', () => {
    let iface: Interface;
    let contract: Contract;
    let provider: JsonRpcProvider;
    beforeAll(() => {
      // mock JSONRPCProvider to return chainId 1 and blockNumber 1
      mockJSONRPCProvider();
    });
    it('should return the correct protocol version', async () => {
      // Expected protocol version
      const expectedVersion: [number, number, number] = [1, 3, 0];
      // mock Contract to return the expected protocol version
      mockContractProtocolVersion(expectedVersion);
      // Initialize the contract
      provider = new JsonRpcProvider(TEST_HTTP_URI);
      iface = new Interface([
        'function protocolVersion() public pure returns (uint8[3] memory)',
      ]);
      contract = new Contract(ADDRESS_ONE, iface, provider);
      // Call getProtocolVersion
      const version = await getProtocolVersion(contract);
      expect(version).toEqual(expectedVersion);
    });
    it('should return [1,0,0] when the call throws an error', async () => {
      // mock Contract to throw an error
      mockContractProtocolVersion(IMPLICIT_INITIAL_PROTOCOL_VERSION, true);
      // Initialize the contract
      const iface = new Interface([
        'function protocolVersion() public pure returns (uint8[3] memory)',
      ]);
      const provider = new JsonRpcProvider(TEST_HTTP_URI);
      const contract = new Contract(ADDRESS_ONE, iface, provider);
      // Call getProtocolVersion
      const version = await getProtocolVersion(contract);
      expect(version).toEqual(IMPLICIT_INITIAL_PROTOCOL_VERSION);
    });
  });
});
