import {getNamedTypesFromMetadata} from '../../src/metadata';
import {TEST_ABI} from '../constants';

describe('Utils', () => {
  describe('getNamedTypesFromMetadata', () => {
    it('test abi with recursion and multiple types', () => {
      const result = getNamedTypesFromMetadata(TEST_ABI);
      expect(result).toEqual([
        'tuple(address b1, tuple(uint256 c1, tuple(address d1, tuple(address[] e1, tuple(uint32 f1, tuple(uint256 g1, uint256 g2))))))',
      ]);
    });
  });
});
