//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorsAbi = [
  {
    type: 'error',
    inputs: [{name: 'body', internalType: 'address', type: 'address'}],
    name: 'BodyResultTypeNotSet',
  },
  {
    type: 'error',
    inputs: [
      {name: 'stageId', internalType: 'uint256', type: 'uint256'},
      {name: 'body', internalType: 'address', type: 'address'},
    ],
    name: 'DuplicateBodyAddress',
  },
  {type: 'error', inputs: [], name: 'EmptyMetadata'},
  {type: 'error', inputs: [], name: 'IncorrectActionCount'},
  {type: 'error', inputs: [], name: 'InsufficientGas'},
  {type: 'error', inputs: [], name: 'InterfaceNotSupported'},
  {type: 'error', inputs: [], name: 'InvalidCustomParamsForFirstStage'},
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'NonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalAdvanceForbidden',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalAlreadyCancelled',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalAlreadyExists',
  },
  {
    type: 'error',
    inputs: [
      {name: 'proposalId', internalType: 'uint256', type: 'uint256'},
      {name: 'stageId', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'ProposalCanNotBeCancelled',
  },
  {
    type: 'error',
    inputs: [
      {name: 'proposalId', internalType: 'uint256', type: 'uint256'},
      {name: 'stageId', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'ProposalCanNotBeEdited',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalExecutionForbidden',
  },
  {type: 'error', inputs: [], name: 'StageCountZero'},
  {type: 'error', inputs: [], name: 'StageDurationsInvalid'},
  {
    type: 'error',
    inputs: [
      {name: 'currentStageId', internalType: 'uint64', type: 'uint64'},
      {name: 'reportedStageId', internalType: 'uint64', type: 'uint64'},
    ],
    name: 'StageIdInvalid',
  },
  {type: 'error', inputs: [], name: 'StageThresholdsInvalid'},
  {
    type: 'error',
    inputs: [{name: '', internalType: 'uint64', type: 'uint64'}],
    name: 'StartDateInvalid',
  },
  {type: 'error', inputs: [], name: 'Uint16MaxSizeExceeded'},
  {
    type: 'error',
    inputs: [
      {name: 'proposalId', internalType: 'uint256', type: 'uint256'},
      {name: 'currentState', internalType: 'uint8', type: 'uint8'},
      {name: 'allowedStates', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'UnexpectedProposalState',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SPPRuleCondition
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const sppRuleConditionAbi = [
  {
    type: 'constructor',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_rules',
        internalType: 'struct RuledCondition.Rule[]',
        type: 'tuple[]',
        components: [
          {name: 'id', internalType: 'uint8', type: 'uint8'},
          {name: 'op', internalType: 'uint8', type: 'uint8'},
          {name: 'value', internalType: 'uint240', type: 'uint240'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPDATE_RULES_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
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
    inputs: [{name: '_x', internalType: 'uint256', type: 'uint256'}],
    name: 'decodeRuleValue',
    outputs: [
      {name: 'a', internalType: 'uint32', type: 'uint32'},
      {name: 'b', internalType: 'uint32', type: 'uint32'},
      {name: 'c', internalType: 'uint32', type: 'uint32'},
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {name: 'startingRuleIndex', internalType: 'uint256', type: 'uint256'},
      {name: 'successRuleIndex', internalType: 'uint256', type: 'uint256'},
      {name: 'failureRuleIndex', internalType: 'uint256', type: 'uint256'},
    ],
    name: 'encodeIfElse',
    outputs: [{name: '', internalType: 'uint240', type: 'uint240'}],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {name: 'ruleIndex1', internalType: 'uint256', type: 'uint256'},
      {name: 'ruleIndex2', internalType: 'uint256', type: 'uint256'},
    ],
    name: 'encodeLogicalOperator',
    outputs: [{name: '', internalType: 'uint240', type: 'uint240'}],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getRules',
    outputs: [
      {
        name: '',
        internalType: 'struct RuledCondition.Rule[]',
        type: 'tuple[]',
        components: [
          {name: 'id', internalType: 'uint8', type: 'uint8'},
          {name: 'op', internalType: 'uint8', type: 'uint8'},
          {name: 'value', internalType: 'uint240', type: 'uint240'},
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
      {
        name: '_rules',
        internalType: 'struct RuledCondition.Rule[]',
        type: 'tuple[]',
        components: [
          {name: 'id', internalType: 'uint8', type: 'uint8'},
          {name: 'op', internalType: 'uint8', type: 'uint8'},
          {name: 'value', internalType: 'uint240', type: 'uint240'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
      {name: '', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'isGranted',
    outputs: [{name: 'isPermitted', internalType: 'bool', type: 'bool'}],
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
    inputs: [{name: '_interfaceId', internalType: 'bytes4', type: 'bytes4'}],
    name: 'supportsInterface',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_rules',
        internalType: 'struct RuledCondition.Rule[]',
        type: 'tuple[]',
        components: [
          {name: 'id', internalType: 'uint8', type: 'uint8'},
          {name: 'op', internalType: 'uint8', type: 'uint8'},
          {name: 'value', internalType: 'uint240', type: 'uint240'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'updateRules',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: 'rules',
        internalType: 'struct RuledCondition.Rule[]',
        type: 'tuple[]',
        components: [
          {name: 'id', internalType: 'uint8', type: 'uint8'},
          {name: 'op', internalType: 'uint8', type: 'uint8'},
          {name: 'value', internalType: 'uint240', type: 'uint240'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
        indexed: false,
      },
    ],
    name: 'RulesUpdated',
  },
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
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StagedProposalProcessor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stagedProposalProcessorAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'SET_METADATA_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'SET_TARGET_CONFIG_PERMISSION_ID',
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
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'advanceProposal',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'canExecute',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'canProposalAdvance',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_metadata', internalType: 'bytes', type: 'bytes'},
      {
        name: '_actions',
        internalType: 'struct Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
      {name: '_allowFailureMap', internalType: 'uint128', type: 'uint128'},
      {name: '_startDate', internalType: 'uint64', type: 'uint64'},
      {name: '_proposalParams', internalType: 'bytes[][]', type: 'bytes[][]'},
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
        internalType: 'struct Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
      {name: '_startDate', internalType: 'uint64', type: 'uint64'},
      {name: '', internalType: 'uint64', type: 'uint64'},
      {name: '_data', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'createProposal',
    outputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'customProposalParamsABI',
    outputs: [{name: '', internalType: 'string', type: 'string'}],
    stateMutability: 'pure',
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
      {name: '_proposalId', internalType: 'uint256', type: 'uint256'},
      {name: '_metadata', internalType: 'bytes', type: 'bytes'},
      {
        name: '_actions',
        internalType: 'struct Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    name: 'edit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'execute',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'uint256', type: 'uint256'},
      {name: '_stageId', internalType: 'uint16', type: 'uint16'},
      {name: '_body', internalType: 'address', type: 'address'},
    ],
    name: 'getBodyProposalId',
    outputs: [{name: '', internalType: 'uint256', type: 'uint256'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'uint256', type: 'uint256'},
      {name: '_stageId', internalType: 'uint16', type: 'uint16'},
      {name: '_body', internalType: 'address', type: 'address'},
    ],
    name: 'getBodyResult',
    outputs: [
      {
        name: '',
        internalType: 'enum StagedProposalProcessor.ResultType',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'uint256', type: 'uint256'},
      {name: '_stageId', internalType: 'uint16', type: 'uint16'},
      {name: '_index', internalType: 'uint256', type: 'uint256'},
    ],
    name: 'getCreateProposalParams',
    outputs: [{name: '', internalType: 'bytes', type: 'bytes'}],
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
    name: 'getCurrentTargetConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct IPlugin.TargetConfig',
        type: 'tuple',
        components: [
          {name: 'target', internalType: 'address', type: 'address'},
          {
            name: 'operation',
            internalType: 'enum IPlugin.Operation',
            type: 'uint8',
          },
        ],
      },
    ],
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
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'getProposal',
    outputs: [
      {
        name: '',
        internalType: 'struct StagedProposalProcessor.Proposal',
        type: 'tuple',
        components: [
          {name: 'allowFailureMap', internalType: 'uint128', type: 'uint128'},
          {name: 'lastStageTransition', internalType: 'uint64', type: 'uint64'},
          {name: 'currentStage', internalType: 'uint16', type: 'uint16'},
          {name: 'stageConfigIndex', internalType: 'uint16', type: 'uint16'},
          {name: 'executed', internalType: 'bool', type: 'bool'},
          {name: 'canceled', internalType: 'bool', type: 'bool'},
          {name: 'creator', internalType: 'address', type: 'address'},
          {
            name: 'actions',
            internalType: 'struct Action[]',
            type: 'tuple[]',
            components: [
              {name: 'to', internalType: 'address', type: 'address'},
              {name: 'value', internalType: 'uint256', type: 'uint256'},
              {name: 'data', internalType: 'bytes', type: 'bytes'},
            ],
          },
          {
            name: 'targetConfig',
            internalType: 'struct IPlugin.TargetConfig',
            type: 'tuple',
            components: [
              {name: 'target', internalType: 'address', type: 'address'},
              {
                name: 'operation',
                internalType: 'enum IPlugin.Operation',
                type: 'uint8',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'uint256', type: 'uint256'},
      {name: '_stageId', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'getProposalTally',
    outputs: [
      {name: 'approvals', internalType: 'uint256', type: 'uint256'},
      {name: 'vetoes', internalType: 'uint256', type: 'uint256'},
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_index', internalType: 'uint256', type: 'uint256'}],
    name: 'getStages',
    outputs: [
      {
        name: '',
        internalType: 'struct StagedProposalProcessor.Stage[]',
        type: 'tuple[]',
        components: [
          {
            name: 'bodies',
            internalType: 'struct StagedProposalProcessor.Body[]',
            type: 'tuple[]',
            components: [
              {name: 'addr', internalType: 'address', type: 'address'},
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'tryAdvance', internalType: 'bool', type: 'bool'},
              {
                name: 'resultType',
                internalType: 'enum StagedProposalProcessor.ResultType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'voteDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'cancelable', internalType: 'bool', type: 'bool'},
          {name: 'editable', internalType: 'bool', type: 'bool'},
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTargetConfig',
    outputs: [
      {
        name: '',
        internalType: 'struct IPlugin.TargetConfig',
        type: 'tuple',
        components: [
          {name: 'target', internalType: 'address', type: 'address'},
          {
            name: 'operation',
            internalType: 'enum IPlugin.Operation',
            type: 'uint8',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getTrustedForwarder',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_account', internalType: 'address', type: 'address'}],
    name: 'hasAdvancePermission',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_account', internalType: 'address', type: 'address'}],
    name: 'hasExecutePermission',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'hasSucceeded',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
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
            name: 'bodies',
            internalType: 'struct StagedProposalProcessor.Body[]',
            type: 'tuple[]',
            components: [
              {name: 'addr', internalType: 'address', type: 'address'},
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'tryAdvance', internalType: 'bool', type: 'bool'},
              {
                name: 'resultType',
                internalType: 'enum StagedProposalProcessor.ResultType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'voteDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'cancelable', internalType: 'bool', type: 'bool'},
          {name: 'editable', internalType: 'bool', type: 'bool'},
        ],
      },
      {name: '_pluginMetadata', internalType: 'bytes', type: 'bytes'},
      {
        name: '_targetConfig',
        internalType: 'struct IPlugin.TargetConfig',
        type: 'tuple',
        components: [
          {name: 'target', internalType: 'address', type: 'address'},
          {
            name: 'operation',
            internalType: 'enum IPlugin.Operation',
            type: 'uint8',
          },
        ],
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_forwarder', internalType: 'address', type: 'address'}],
    name: 'isTrustedForwarder',
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
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_proposalId', internalType: 'uint256', type: 'uint256'},
      {name: '_stageId', internalType: 'uint16', type: 'uint16'},
      {
        name: '_resultType',
        internalType: 'enum StagedProposalProcessor.ResultType',
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
    inputs: [{name: '_metadata', internalType: 'bytes', type: 'bytes'}],
    name: 'setMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_targetConfig',
        internalType: 'struct IPlugin.TargetConfig',
        type: 'tuple',
        components: [
          {name: 'target', internalType: 'address', type: 'address'},
          {
            name: 'operation',
            internalType: 'enum IPlugin.Operation',
            type: 'uint8',
          },
        ],
      },
    ],
    name: 'setTargetConfig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_forwarder', internalType: 'address', type: 'address'}],
    name: 'setTrustedForwarder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'state',
    outputs: [
      {
        name: '',
        internalType: 'enum StagedProposalProcessor.ProposalState',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
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
    inputs: [
      {
        name: '_stages',
        internalType: 'struct StagedProposalProcessor.Stage[]',
        type: 'tuple[]',
        components: [
          {
            name: 'bodies',
            internalType: 'struct StagedProposalProcessor.Body[]',
            type: 'tuple[]',
            components: [
              {name: 'addr', internalType: 'address', type: 'address'},
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'tryAdvance', internalType: 'bool', type: 'bool'},
              {
                name: 'resultType',
                internalType: 'enum StagedProposalProcessor.ResultType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'voteDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'cancelable', internalType: 'bool', type: 'bool'},
          {name: 'editable', internalType: 'bool', type: 'bool'},
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
      {name: 'beacon', internalType: 'address', type: 'address', indexed: true},
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
      {name: 'metadata', internalType: 'bytes', type: 'bytes', indexed: false},
    ],
    name: 'MetadataSet',
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
      {name: 'stageId', internalType: 'uint16', type: 'uint16', indexed: true},
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
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
      {name: 'stageId', internalType: 'uint16', type: 'uint16', indexed: true},
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
    ],
    name: 'ProposalCanceled',
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
        internalType: 'struct Action[]',
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
      {name: 'stageId', internalType: 'uint16', type: 'uint16', indexed: true},
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
      {name: 'metadata', internalType: 'bytes', type: 'bytes', indexed: false},
      {
        name: 'actions',
        internalType: 'struct Action[]',
        type: 'tuple[]',
        components: [
          {name: 'to', internalType: 'address', type: 'address'},
          {name: 'value', internalType: 'uint256', type: 'uint256'},
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
        indexed: false,
      },
    ],
    name: 'ProposalEdited',
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
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {name: 'stageId', internalType: 'uint16', type: 'uint16', indexed: true},
      {name: 'body', internalType: 'address', type: 'address', indexed: true},
    ],
    name: 'ProposalResultReported',
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
            name: 'bodies',
            internalType: 'struct StagedProposalProcessor.Body[]',
            type: 'tuple[]',
            components: [
              {name: 'addr', internalType: 'address', type: 'address'},
              {name: 'isManual', internalType: 'bool', type: 'bool'},
              {name: 'tryAdvance', internalType: 'bool', type: 'bool'},
              {
                name: 'resultType',
                internalType: 'enum StagedProposalProcessor.ResultType',
                type: 'uint8',
              },
            ],
          },
          {name: 'maxAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'minAdvance', internalType: 'uint64', type: 'uint64'},
          {name: 'voteDuration', internalType: 'uint64', type: 'uint64'},
          {name: 'approvalThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'vetoThreshold', internalType: 'uint16', type: 'uint16'},
          {name: 'cancelable', internalType: 'bool', type: 'bool'},
          {name: 'editable', internalType: 'bool', type: 'bool'},
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
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {name: 'stageId', internalType: 'uint16', type: 'uint16', indexed: true},
      {name: 'body', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'bodyProposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'SubProposalCreated',
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
      {name: 'stageId', internalType: 'uint16', type: 'uint16', indexed: true},
      {name: 'body', internalType: 'address', type: 'address', indexed: true},
      {name: 'reason', internalType: 'bytes', type: 'bytes', indexed: false},
    ],
    name: 'SubProposalNotCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'newTargetConfig',
        internalType: 'struct IPlugin.TargetConfig',
        type: 'tuple',
        components: [
          {name: 'target', internalType: 'address', type: 'address'},
          {
            name: 'operation',
            internalType: 'enum IPlugin.Operation',
            type: 'uint8',
          },
        ],
        indexed: false,
      },
    ],
    name: 'TargetSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'forwarder',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'TrustedForwarderUpdated',
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
  {type: 'error', inputs: [], name: 'AlreadyInitialized'},
  {
    type: 'error',
    inputs: [{name: 'body', internalType: 'address', type: 'address'}],
    name: 'BodyResultTypeNotSet',
  },
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
  {type: 'error', inputs: [], name: 'DelegateCallFailed'},
  {
    type: 'error',
    inputs: [
      {name: 'stageId', internalType: 'uint256', type: 'uint256'},
      {name: 'body', internalType: 'address', type: 'address'},
    ],
    name: 'DuplicateBodyAddress',
  },
  {type: 'error', inputs: [], name: 'FunctionDeprecated'},
  {type: 'error', inputs: [], name: 'InsufficientGas'},
  {type: 'error', inputs: [], name: 'InterfaceNotSupported'},
  {
    type: 'error',
    inputs: [
      {
        name: 'targetConfig',
        internalType: 'struct IPlugin.TargetConfig',
        type: 'tuple',
        components: [
          {name: 'target', internalType: 'address', type: 'address'},
          {
            name: 'operation',
            internalType: 'enum IPlugin.Operation',
            type: 'uint8',
          },
        ],
      },
    ],
    name: 'InvalidTargetConfig',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'NonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalAdvanceForbidden',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalAlreadyExists',
  },
  {
    type: 'error',
    inputs: [
      {name: 'proposalId', internalType: 'uint256', type: 'uint256'},
      {name: 'stageId', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'ProposalCanNotBeCancelled',
  },
  {
    type: 'error',
    inputs: [
      {name: 'proposalId', internalType: 'uint256', type: 'uint256'},
      {name: 'stageId', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'ProposalCanNotBeEdited',
  },
  {
    type: 'error',
    inputs: [{name: 'proposalId', internalType: 'uint256', type: 'uint256'}],
    name: 'ProposalExecutionForbidden',
  },
  {type: 'error', inputs: [], name: 'StageCountZero'},
  {type: 'error', inputs: [], name: 'StageDurationsInvalid'},
  {
    type: 'error',
    inputs: [
      {name: 'currentStageId', internalType: 'uint64', type: 'uint64'},
      {name: 'reportedStageId', internalType: 'uint64', type: 'uint64'},
    ],
    name: 'StageIdInvalid',
  },
  {type: 'error', inputs: [], name: 'StageThresholdsInvalid'},
  {
    type: 'error',
    inputs: [{name: '', internalType: 'uint64', type: 'uint64'}],
    name: 'StartDateInvalid',
  },
  {type: 'error', inputs: [], name: 'Uint16MaxSizeExceeded'},
  {
    type: 'error',
    inputs: [
      {name: 'proposalId', internalType: 'uint256', type: 'uint256'},
      {name: 'currentState', internalType: 'uint8', type: 'uint8'},
      {name: 'allowedStates', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'UnexpectedProposalState',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StagedProposalProcessorSetup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stagedProposalProcessorSetupAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'function',
    inputs: [],
    name: 'CONDITION_IMPLEMENTATION',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
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
      {name: '_installationParams', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'prepareInstallation',
    outputs: [
      {name: 'spp', internalType: 'address', type: 'address'},
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
  {
    type: 'error',
    inputs: [
      {name: 'fromBuild', internalType: 'uint16', type: 'uint16'},
      {name: 'thisBuild', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'InvalidUpdatePath',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// StagedProposalProcessorSetupZkSync
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stagedProposalProcessorSetupZkSyncAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'function',
    inputs: [],
    name: 'CONDITION_IMPLEMENTATION',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
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
      {name: '_installationParams', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'prepareInstallation',
    outputs: [
      {name: 'spp', internalType: 'address', type: 'address'},
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
  {
    type: 'error',
    inputs: [
      {name: 'fromBuild', internalType: 'uint16', type: 'uint16'},
      {name: 'thisBuild', internalType: 'uint16', type: 'uint16'},
    ],
    name: 'InvalidUpdatePath',
  },
] as const
