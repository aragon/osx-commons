import {
  InvalidAddressError,
  getInterfaceId,
  getProtocolVersion,
} from '../../src';
import {TEST_HTTP_URI} from '../constants';
import {mockContractProtocolVersion, mockJSONRPCProvider} from '../mocks';
import {Interface} from '@ethersproject/abi';

export const ADDRESS_ONE = `0x${'0'.repeat(39)}1`;
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
    it('should return the correct protocol version', async () => {
      const expectedVersion: [number, number, number] = [1, 3, 0];
      // mock call to the contract
      mockJSONRPCProvider();
      // mock the call to the contract
      mockContractProtocolVersion(expectedVersion);
      const version = await getProtocolVersion(TEST_HTTP_URI, ADDRESS_ONE);
      expect(version).toEqual(expectedVersion);
    });
    it('should fail when an invalid address is passed', async () => {
      const expectedVersion: [number, number, number] = [1, 3, 0];
      // mock call to the contract
      mockJSONRPCProvider();
      // mock the call to the contract
      mockContractProtocolVersion(expectedVersion);
      await expect(() =>
        getProtocolVersion(TEST_HTTP_URI, '0x')
      ).rejects.toThrow(new InvalidAddressError('0x'));
    });
    it('should return [1,0,0] when the call throws an error', async () => {
      const expectedVersion: [number, number, number] = [1, 0, 0];
      // mock call to the contract
      mockJSONRPCProvider();
      // mock the call to the contract
      mockContractProtocolVersion(expectedVersion, true);
      const version = await getProtocolVersion(TEST_HTTP_URI, ADDRESS_ONE);
      expect(version).toEqual(expectedVersion);
    });
  });
});
