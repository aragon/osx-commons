import {MetadataAbiInput} from '../src';

export const TEST_ABI: MetadataAbiInput[] = [
  {
    name: 'a',
    type: 'tuple',
    internalType: 'struct A',
    description: 'A',
    components: [
      {
        name: 'b1',
        type: 'address',
        internalType: 'address',
        description: 'B1',
      },
      {
        name: 'b2',
        type: 'tuple',
        internalType: 'struct B2',
        description: 'B2',
        components: [
          {
            name: 'c1',
            type: 'uint256',
            internalType: 'uint256',
            description: 'C1',
          },
          {
            name: 'c2',
            type: 'tuple',
            internalType: 'struct C2',
            description: 'C2',
            components: [
              {
                name: 'd1',
                type: 'address',
                internalType: 'address',
                description: 'D1',
              },
              {
                name: 'd2',
                type: 'tuple',
                internalType: 'struct D2',
                description: 'D',
                components: [
                  {
                    name: 'e1',
                    type: 'address[]',
                    internalType: 'address[]',
                    description: 'E1',
                  },
                  {
                    name: 'e2',
                    type: 'tuple',
                    internalType: 'struct E2',
                    description: 'E2',
                    components: [
                      {
                        name: 'f1',
                        type: 'uint32',
                        internalType: 'uint32',
                        description: 'F1',
                      },
                      {
                        name: 'f2',
                        type: 'tuple',
                        internalType: 'struct F2',
                        description: 'F2',
                        components: [
                          {
                            name: 'g1',
                            type: 'uint256',
                            internalType: 'uint256',
                            description: 'G1',
                          },
                          {
                            name: 'g2',
                            type: 'uint256',
                            internalType: 'uint256',
                            description: 'G2',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const ADDRESS_ONE = `0x${'0'.repeat(39)}1`;

export const TEST_ENS_NAME = 'subdomain.test.eth';
export const TEST_INVALID_ENS_NAME = 'test.invalid';

export const TEST_IPFS_CID_V0 =
  'QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR';
export const TEST_IPFS_CID_V1 =
  'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi';

export const TEST_IPFS_URI_V0 = `ipfs://${TEST_IPFS_CID_V0}`;
export const TEST_IPFS_URI_V1 = `ipfs://${TEST_IPFS_CID_V1}`;
export const TEST_INVALID_IPFS_CID = '1nv4l1d_c1d';
export const TEST_INVALID_IPFS_URI = `ipfs://${TEST_INVALID_IPFS_CID}`;

export const TEST_HTTP_URI = 'https://test.com';

export const TEST_SUBDOMAIN = 'test';
export const TEST_INVALID_SUBDOMAIN = 'test.invalid';
