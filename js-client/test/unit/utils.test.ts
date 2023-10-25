import { getInterfaceId, getNamedTypesFromMetadata } from '../../src';
import { ERC165_ABI, TEST_ABI } from '../constants';
import { Interface } from '@ethersproject/abi';

describe('Utils', () => {
  describe('getNamedTypesFromMetadata', () => {
    it('test abi with recursion and multiple types', () => {
      const result = getNamedTypesFromMetadata(TEST_ABI);
      expect(result).toEqual([
        'tuple(address b1, tuple(uint256 c1, tuple(address d1, tuple(address[] e1, tuple(uint32 f1, tuple(uint256 g1, uint256 g2))))))',
      ]);
    });
  });
  describe('getInterfaceId', () => {
    it('should return the interface id for an ERC165 contract', () => {
      const result = getInterfaceId(new Interface(ERC165_ABI));
      // defined here: https://eips.ethereum.org/EIPS/eip-165
      expect(result).toEqual('0x01ffc9a7');
    });
  });
});
