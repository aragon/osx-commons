//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Admin
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const adminAbi = [
  {
    type: 'error',
    inputs: [
      {name: 'dao', internalType: 'address', type: 'address'},
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'DaoUnauthorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'version', internalType: 'uint8', type: 'uint8', indexed: false},
    ],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'members',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'MembersAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'members',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
    ],
    name: 'MembersRemoved',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'definingContract',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'MembershipContractAnnounced',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'startDate',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {name: 'endDate', internalType: 'uint64', type: 'uint64', indexed: false},
      {name: 'metadata', internalType: 'bytes', type: 'bytes', indexed: false},
      {
        name: 'actions',
        internalType: 'struct IDAO.Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
        indexed: false,
      },
      {
        name: 'allowFailureMap',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXECUTE_PROPOSAL_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_metadata', internalType: 'bytes', type: 'bytes'},
      {
        name: '_actions',
        internalType: 'struct IDAO.Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
      {name: '_startDate', internalType: 'uint64', type: 'uint64'},
      {name: '_endDate', internalType: 'uint64', type: 'uint64'},
    ],
    name: 'createProposal',
    outputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'dao',
    outputs: [{name: '', internalType: 'contract IDAO', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_metadata', internalType: 'bytes', type: 'bytes'},
      {
        name: '_actions',
        internalType: 'struct IDAO.Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
      {name: '_allowFailureMap', internalType: 'uint256', type: 'uint256'},
    ],
    name: 'executeProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_dao', internalType: 'contract IDAO', type: 'address'}],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_account', internalType: 'address', type: 'address'}],
    name: 'isMember',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pluginType',
    outputs: [
      {name: '', internalType: 'enum IPlugin.PluginType', type: 'uint8'},
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalCount',
    outputs: [{name: '', internalType: 'uint256', type: 'uint256'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolVersion',
    outputs: [{name: '', internalType: 'uint8[3]', type: 'uint8[3]'}],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{name: '_forwarder', internalType: 'address', type: 'address'}],
    name: 'setForwarder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_interfaceId', internalType: 'bytes4', type: 'bytes4'}],
    name: 'supportsInterface',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'trustedForwarder',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AdminSetup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const adminSetupAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'error',
    inputs: [{name: 'admin', internalType: 'address', type: 'address'}],
    name: 'AdminAddressInvalid',
  },
  {type: 'error', inputs: [], name: 'NonUpgradeablePlugin'},
  {
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {name: '_data', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'prepareInstallation',
    outputs: [
      {name: 'plugin', internalType: 'address', type: 'address'},
      {
        name: 'preparedSetupData',
        internalType: 'struct IPluginSetup.PreparedSetupData',
        type: 'tuple',
        components: [
          {name: 'helpers', internalType: 'address[]', type: 'address[]'},
          {
            name: 'permissions',
            internalType: 'struct PermissionLib.MultiTargetPermission[]',
            type: 'tuple[]',
            components: [
              {
                name: 'operation',
                internalType: 'enum PermissionLib.Operation',
                type: 'uint8',
              },
              {name: 'where', internalType: 'address', type: 'address'},
              {name: 'who', internalType: 'address', type: 'address'},
              {name: 'condition', internalType: 'address', type: 'address'},
              {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
            ],
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_payload',
        internalType: 'struct IPluginSetup.SetupPayload',
        type: 'tuple',
        components: [
          {name: 'plugin', internalType: 'address', type: 'address'},
          {
            name: 'currentHelpers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    name: 'prepareUninstallation',
    outputs: [
      {
        name: 'permissions',
        internalType: 'struct PermissionLib.MultiTargetPermission[]',
        type: 'tuple[]',
        components: [
          {
            name: 'operation',
            internalType: 'enum PermissionLib.Operation',
            type: 'uint8',
          },
          {name: 'where', internalType: 'address', type: 'address'},
          {name: 'who', internalType: 'address', type: 'address'},
          {name: 'condition', internalType: 'address', type: 'address'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {name: '_fromBuild', internalType: 'uint16', type: 'uint16'},
      {
        name: '_payload',
        internalType: 'struct IPluginSetup.SetupPayload',
        type: 'tuple',
        components: [
          {name: 'plugin', internalType: 'address', type: 'address'},
          {
            name: 'currentHelpers',
            internalType: 'address[]',
            type: 'address[]',
          },
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    name: 'prepareUpdate',
    outputs: [
      {name: '', internalType: 'bytes', type: 'bytes'},
      {
        name: '',
        internalType: 'struct IPluginSetup.PreparedSetupData',
        type: 'tuple',
        components: [
          {name: 'helpers', internalType: 'address[]', type: 'address[]'},
          {
            name: 'permissions',
            internalType: 'struct PermissionLib.MultiTargetPermission[]',
            type: 'tuple[]',
            components: [
              {
                name: 'operation',
                internalType: 'enum PermissionLib.Operation',
                type: 'uint8',
              },
              {name: 'where', internalType: 'address', type: 'address'},
              {name: 'who', internalType: 'address', type: 'address'},
              {name: 'condition', internalType: 'address', type: 'address'},
              {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
            ],
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolVersion',
    outputs: [{name: '', internalType: 'uint8[3]', type: 'uint8[3]'}],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{name: '_interfaceId', internalType: 'bytes4', type: 'bytes4'}],
    name: 'supportsInterface',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
] as const;
