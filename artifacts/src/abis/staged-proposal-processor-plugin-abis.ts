//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AlwaysTrueCondition
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const alwaysTrueConditionAbi = [
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
      {name: '_data', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'isGranted',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorsAbi = [
  {type: 'error', inputs: [], name: 'CallerNotABody'},
  {type: 'error', inputs: [], name: 'EmptyMetadata'},
  {type: 'error', inputs: [], name: 'InsufficientGas'},
  {type: 'error', inputs: [], name: 'NotPossible'},
  {
    type: 'error',
    inputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    name: 'ProposalCannotExecute',
  },
  {type: 'error', inputs: [], name: 'ProposalNotExists'},
  {type: 'error', inputs: [], name: 'StageCountZero'},
  {type: 'error', inputs: [], name: 'StageDurationAlreadyPassed'},
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StagedProposalProcessor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stagedProposalProcessorAbi = [
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
  {type: 'error', inputs: [], name: 'EmptyMetadata'},
  {type: 'error', inputs: [], name: 'InsufficientGas'},
  {type: 'error', inputs: [], name: 'ProposalNotExists'},
  {type: 'error', inputs: [], name: 'StageCountZero'},
  {type: 'error', inputs: [], name: 'StageDurationAlreadyPassed'},
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'beacon',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'BeaconUpgraded',
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
        name: 'releaseMetadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'MetadataUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'stageId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'ProposalAdvanced',
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
      {
        name: 'endDate',
        internalType: 'uint64',
        type: 'uint64',
        indexed: false,
      },
      {
        name: 'metadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {
        name: 'plugin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'ProposalResult',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'stages',
        internalType: 'struct StagedProposalProcessor.Stage[]',
        type: 'tuple[]',
        components: [
          {
            name: 'plugins',
            internalType: 'struct StagedProposalProcessor.Plugin[]',
            type: 'tuple[]',
            components: [
              {
                name: 'pluginAddress',
                internalType: 'address',
                type: 'address',
              },
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'allowedBody', internalType: 'address', type: 'address'},
              {
                name: 'proposalType',
                internalType: 'enum StagedProposalProcessor.ProposalType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'stageDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
        ],
        indexed: false,
      },
    ],
    name: 'StagesUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'Upgraded',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADVANCE_PROPOSAL_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CREATE_PROPOSAL_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPDATE_METADATA_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPDATE_STAGES_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_PLUGIN_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'bytes32', type: 'bytes32'}],
    name: 'advanceProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'bytes32', type: 'bytes32'}],
    name: 'canProposalAdvance',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
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
      {name: '', internalType: 'uint64', type: 'uint64'},
    ],
    name: 'createProposal',
    outputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    stateMutability: 'nonpayable',
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
      {name: '_startDate', internalType: 'uint64', type: 'uint64'},
    ],
    name: 'createProposal',
    outputs: [{name: 'proposalId', internalType: 'bytes32', type: 'bytes32'}],
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
    inputs: [],
    name: 'getCurrentConfigIndex',
    outputs: [{name: '', internalType: 'uint16', type: 'uint16'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getMetadata',
    outputs: [{name: '', internalType: 'bytes', type: 'bytes'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'bytes32', type: 'bytes32'},
      {name: '_stageId', internalType: 'uint16', type: 'uint16'},
      {
        name: '_proposalType',
        internalType: 'enum StagedProposalProcessor.ProposalType',
        type: 'uint8',
      },
      {name: '_body', internalType: 'address', type: 'address'},
    ],
    name: 'getPluginResult',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'bytes32', type: 'bytes32'}],
    name: 'getProposal',
    outputs: [
      {
        name: '',
        internalType: 'struct StagedProposalProcessor.Proposal',
        type: 'tuple',
        components: [
          {name: 'allowFailureMap', internalType: 'uint256', type: 'uint256'},
          {name: 'creator', internalType: 'address', type: 'address'},
          {
            name: 'lastStageTransition',
            internalType: 'uint64',
            type: 'uint64',
          },
          {name: 'metadata', internalType: 'bytes', type: 'bytes'},
          {
            name: 'actions',
            internalType: 'struct IDAO.Action[]',
            type: 'tuple[]',
            components: [
              {name: 'to', internalType: 'address', type: 'address'},
              {name: 'value', internalType: 'uint256', type: 'uint256'},
              {name: 'data', internalType: 'bytes', type: 'bytes'},
            ],
          },
          {name: 'currentStage', internalType: 'uint16', type: 'uint16'},
          {name: 'stageConfigIndex', internalType: 'uint16', type: 'uint16'},
          {name: 'executed', internalType: 'bool', type: 'bool'},
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getStages',
    outputs: [
      {
        name: '',
        internalType: 'struct StagedProposalProcessor.Stage[]',
        type: 'tuple[]',
        components: [
          {
            name: 'plugins',
            internalType: 'struct StagedProposalProcessor.Plugin[]',
            type: 'tuple[]',
            components: [
              {
                name: 'pluginAddress',
                internalType: 'address',
                type: 'address',
              },
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'allowedBody', internalType: 'address', type: 'address'},
              {
                name: 'proposalType',
                internalType: 'enum StagedProposalProcessor.ProposalType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'stageDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
        ],
      },
    ],
    stateMutability: 'view',
  },
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
      {name: '_dao', internalType: 'contract IDAO', type: 'address'},
      {name: '_trustedForwarder', internalType: 'address', type: 'address'},
      {
        name: '_stages',
        internalType: 'struct StagedProposalProcessor.Stage[]',
        type: 'tuple[]',
        components: [
          {
            name: 'plugins',
            internalType: 'struct StagedProposalProcessor.Plugin[]',
            type: 'tuple[]',
            components: [
              {
                name: 'pluginAddress',
                internalType: 'address',
                type: 'address',
              },
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'allowedBody', internalType: 'address', type: 'address'},
              {
                name: 'proposalType',
                internalType: 'enum StagedProposalProcessor.ProposalType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'stageDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
        ],
      },
      {name: '_metadata', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'bytes32', type: 'bytes32'},
      {
        name: '_proposalType',
        internalType: 'enum StagedProposalProcessor.ProposalType',
        type: 'uint8',
      },
      {name: '_tryAdvance', internalType: 'bool', type: 'bool'},
    ],
    name: 'reportProposalResult',
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
  {
    type: 'function',
    inputs: [{name: '_metadata', internalType: 'bytes', type: 'bytes'}],
    name: 'updateMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_stages',
        internalType: 'struct StagedProposalProcessor.Stage[]',
        type: 'tuple[]',
        components: [
          {
            name: 'plugins',
            internalType: 'struct StagedProposalProcessor.Plugin[]',
            type: 'tuple[]',
            components: [
              {
                name: 'pluginAddress',
                internalType: 'address',
                type: 'address',
              },
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'allowedBody', internalType: 'address', type: 'address'},
              {
                name: 'proposalType',
                internalType: 'enum StagedProposalProcessor.ProposalType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'stageDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
        ],
      },
    ],
    name: 'updateStages',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: 'newImplementation', internalType: 'address', type: 'address'},
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: 'newImplementation', internalType: 'address', type: 'address'},
      {name: 'data', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StagedProposalProcessorSetup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stagedProposalProcessorSetupAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'error',
    inputs: [
      {name: 'fromBuild', internalType: 'uint16', type: 'uint16'},
      {name: 'thisBuild', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'InvalidUpdatePath',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ADVANCE_PROPOSAL_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPDATE_STAGES_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
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
              {
                name: 'permissionId',
                internalType: 'bytes32',
                type: 'bytes32',
              },
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
    stateMutability: 'view',
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
              {
                name: 'permissionId',
                internalType: 'bytes32',
                type: 'bytes32',
              },
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TrustedForwarder
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const trustedForwarderAbi = [
  {type: 'error', inputs: [], name: 'NotPossible'},
  {
    type: 'function',
    inputs: [
      {name: '_callId', internalType: 'bytes32', type: 'bytes32'},
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
    name: 'execute',
    outputs: [
      {name: 'execResults', internalType: 'bytes[]', type: 'bytes[]'},
      {name: 'failureMap', internalType: 'uint256', type: 'uint256'},
    ],
    stateMutability: 'nonpayable',
  },
] as const;
