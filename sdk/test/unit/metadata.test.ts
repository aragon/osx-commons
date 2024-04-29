import {getNamedTypesFromMetadata} from '../../src';
import {TEST_ABI} from '../constants';

describe('Utils', () => {
  describe('getNamedTypesFromMetadata', () => {
    it('test abi with recursion and multiple types', () => {
      const result = getNamedTypesFromMetadata(TEST_ABI);
      expect(result).toEqual([
        'tuple(address b1, tuple(uint256 c1, tuple(address d1, tuple(address[] e1, tuple(uint32 f1, tuple(uint256 g1, uint256 g2))))))',
      ]);
    });

    it('simple', async () => {
      const inputs = [
        {
          name: 'number',
          type: 'uint256',
          internalType: 'uint256',
          description: '',
        },
        {
          name: 'account',
          type: 'address',
          internalType: 'address',
          description: '',
        },
      ];

      expect(getNamedTypesFromMetadata(inputs)).toEqual([
        'uint256 number',
        'address account',
      ]);
    });

    it('array', async () => {
      const inputs = [
        {
          internalType: 'address[]',
          name: 'members',
          type: 'address[]',
          description: '',
        },
      ];

      expect(getNamedTypesFromMetadata(inputs)).toEqual(['address[] members']);
    });

    it('struct', async () => {
      const inputs = [
        {
          components: [
            {
              internalType: 'bool',
              name: 'onlyListed',
              type: 'bool',
              description: '',
            },
            {
              internalType: 'uint16',
              name: 'minApprovals',
              type: 'uint16',
              description: '',
            },
          ],
          internalType: 'struct Multisig.MultisigSettings',
          name: 'multisigSettings',
          type: 'tuple',
          description: '',
        },
      ];

      expect(getNamedTypesFromMetadata(inputs)).toEqual([
        'tuple(bool onlyListed, uint16 minApprovals)',
      ]);
    });

    it('nested struct', async () => {
      const inputs = [
        {
          components: [
            {
              internalType: 'bool',
              name: 'var1',
              type: 'bool',
              description: '',
            },
            {
              components: [
                {
                  internalType: 'bool',
                  name: 'var2',
                  type: 'bool',
                  description: '',
                },
                {
                  internalType: 'uint16',
                  name: 'var3',
                  type: 'uint16',
                  description: '',
                },
                {
                  components: [
                    {
                      internalType: 'bool',
                      name: 'var4',
                      type: 'bool',
                      description: '',
                    },
                    {
                      internalType: 'uint16',
                      name: 'var5',
                      type: 'uint16',
                      description: '',
                    },
                    {
                      internalType: 'bytes',
                      name: 'var6',
                      type: 'bytes',
                      description: '',
                    },
                  ],
                  internalType: 'struct Example',
                  name: 'layer3',
                  type: 'tuple',
                  description: '',
                },
              ],
              internalType: 'struct Example',
              name: 'layer2',
              type: 'tuple',
              description: '',
            },
          ],
          internalType: 'struct Example',
          name: 'layer1',
          type: 'tuple',
          description: '',
        },
      ];

      expect(getNamedTypesFromMetadata(inputs)).toEqual([
        'tuple(bool var1, tuple(bool var2, uint16 var3, tuple(bool var4, uint16 var5, bytes var6)))',
      ]);
    });

    it('array of structs', async () => {
      const inputs = [
        {
          components: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
              description: '',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
              description: '',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
              description: '',
            },
          ],
          indexed: false,
          internalType: 'struct IDAO.Action[]',
          name: 'actions',
          type: 'tuple[]',
          description: '',
        },
      ];

      expect(getNamedTypesFromMetadata(inputs)).toEqual([
        'tuple(address to, uint256 value, bytes data)[]',
      ]);
    });

    it('nested array of structs', async () => {
      const inputs = [
        {
          components: [
            {
              internalType: 'address',
              name: 'to',
              type: 'address',
              description: '',
            },
            {
              internalType: 'uint256',
              name: 'value',
              type: 'uint256',
              description: '',
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
              description: '',
            },
            {
              components: [
                {
                  internalType: 'address',
                  name: 'to',
                  type: 'address',
                  description: '',
                },
                {
                  internalType: 'uint256',
                  name: 'value',
                  type: 'uint256',
                  description: '',
                },
                {
                  internalType: 'bytes',
                  name: 'data',
                  type: 'bytes',
                  description: '',
                },
              ],
              indexed: false,
              internalType: 'struct IDAO.Action[]',
              name: 'actions',
              type: 'tuple[]',
              description: '',
            },
          ],
          indexed: false,
          internalType: 'struct IDAO.Action[]',
          name: 'actions',
          type: 'tuple[]',
          description: '',
        },
      ];

      expect(getNamedTypesFromMetadata(inputs)).toEqual([
        'tuple(address to, uint256 value, bytes data, tuple(address to, uint256 value, bytes data)[])[]',
      ]);
    });
  });
});
