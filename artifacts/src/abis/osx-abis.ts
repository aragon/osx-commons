//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CallbackHandler
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const callbackHandlerAbi = [
  {
    type: 'error',
    inputs: [
      {name: 'callbackSelector', internalType: 'bytes4', type: 'bytes4'},
      {name: 'magicNumber', internalType: 'bytes4', type: 'bytes4'},
    ],
    name: 'UnknownCallback',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {name: 'sig', internalType: 'bytes4', type: 'bytes4', indexed: true},
      {name: 'data', internalType: 'bytes', type: 'bytes', indexed: false},
    ],
    name: 'CallbackReceived',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DAO
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const daoAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'error',
    inputs: [{name: 'index', internalType: 'uint256', type: 'uint256'}],
    name: 'ActionFailed',
  },
  {type: 'error', inputs: [], name: 'AnyAddressDisallowedForWhoAndWhere'},
  {
    type: 'error',
    inputs: [
      {
        name: 'condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'ConditionInterfaceNotSupported',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'ConditionNotAContract',
  },
  {type: 'error', inputs: [], name: 'FunctionRemoved'},
  {type: 'error', inputs: [], name: 'GrantWithConditionNotSupported'},
  {type: 'error', inputs: [], name: 'InsufficientGas'},
  {
    type: 'error',
    inputs: [
      {name: 'expected', internalType: 'uint256', type: 'uint256'},
      {name: 'actual', internalType: 'uint256', type: 'uint256'},
    ],
    name: 'NativeTokenDepositAmountMismatch',
  },
  {
    type: 'error',
    inputs: [
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
      {name: 'currentCondition', internalType: 'address', type: 'address'},
      {name: 'newCondition', internalType: 'address', type: 'address'},
    ],
    name: 'PermissionAlreadyGrantedForDifferentCondition',
  },
  {type: 'error', inputs: [], name: 'PermissionsForAnyAddressDisallowed'},
  {
    type: 'error',
    inputs: [
      {name: 'protocolVersion', internalType: 'uint8[3]', type: 'uint8[3]'},
    ],
    name: 'ProtocolVersionUpgradeNotSupported',
  },
  {type: 'error', inputs: [], name: 'ReentrantCall'},
  {type: 'error', inputs: [], name: 'TooManyActions'},
  {
    type: 'error',
    inputs: [
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'Unauthorized',
  },
  {
    type: 'error',
    inputs: [
      {name: 'callbackSelector', internalType: 'bytes4', type: 'bytes4'},
      {name: 'magicNumber', internalType: 'bytes4', type: 'bytes4'},
    ],
    name: 'UnknownCallback',
  },
  {type: 'error', inputs: [], name: 'ZeroAmount'},
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
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {name: 'sig', internalType: 'bytes4', type: 'bytes4', indexed: true},
      {name: 'data', internalType: 'bytes', type: 'bytes', indexed: false},
    ],
    name: 'CallbackReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
      {name: 'token', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: '_reference',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'Deposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'actor', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'callId',
        internalType: 'bytes32',
        type: 'bytes32',
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
      {
        name: 'failureMap',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'execResults',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
    ],
    name: 'Executed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'permissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {name: 'here', internalType: 'address', type: 'address', indexed: true},
      {name: 'where', internalType: 'address', type: 'address', indexed: false},
      {name: 'who', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'condition',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Granted',
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
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NativeTokenDeposited',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'daoURI', internalType: 'string', type: 'string', indexed: false},
    ],
    name: 'NewURI',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'permissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {name: 'here', internalType: 'address', type: 'address', indexed: true},
      {name: 'where', internalType: 'address', type: 'address', indexed: false},
      {name: 'who', internalType: 'address', type: 'address', indexed: true},
    ],
    name: 'Revoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'interfaceId',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'callbackSelector',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
      {
        name: 'magicNumber',
        internalType: 'bytes4',
        type: 'bytes4',
        indexed: false,
      },
    ],
    name: 'StandardCallbackRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'forwarder',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TrustedForwarderSet',
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
  {type: 'fallback', stateMutability: 'nonpayable'},
  {
    type: 'function',
    inputs: [],
    name: 'EXECUTE_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'REGISTER_STANDARD_CALLBACK_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
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
    name: 'SET_TRUSTED_FORWARDER_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_DAO_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'VALIDATE_SIGNATURE_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_items',
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
    name: 'applyMultiTargetPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {
        name: 'items',
        internalType: 'struct PermissionLib.SingleTargetPermission[]',
        type: 'tuple[]',
        components: [
          {
            name: 'operation',
            internalType: 'enum PermissionLib.Operation',
            type: 'uint8',
          },
          {name: 'who', internalType: 'address', type: 'address'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'applySingleTargetPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'daoURI',
    outputs: [{name: '', internalType: 'string', type: 'string'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_token', internalType: 'address', type: 'address'},
      {name: '_amount', internalType: 'uint256', type: 'uint256'},
      {name: '_reference', internalType: 'string', type: 'string'},
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
  },
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
  {
    type: 'function',
    inputs: [],
    name: 'getTrustedForwarder',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'grant',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
      {
        name: '_condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'grantWithCondition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
      {name: '_data', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'hasPermission',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_metadata', internalType: 'bytes', type: 'bytes'},
      {name: '_initialOwner', internalType: 'address', type: 'address'},
      {name: '_trustedForwarder', internalType: 'address', type: 'address'},
      {name: 'daoURI_', internalType: 'string', type: 'string'},
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_previousProtocolVersion',
        internalType: 'uint8[3]',
        type: 'uint8[3]',
      },
      {name: '_initData', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'initializeFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_hash', internalType: 'bytes32', type: 'bytes32'},
      {name: '_signature', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'isValidSignature',
    outputs: [{name: '', internalType: 'bytes4', type: 'bytes4'}],
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
      {name: '_interfaceId', internalType: 'bytes4', type: 'bytes4'},
      {name: '_callbackSelector', internalType: 'bytes4', type: 'bytes4'},
      {name: '_magicNumber', internalType: 'bytes4', type: 'bytes4'},
    ],
    name: 'registerStandardCallback',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: 'newDaoURI', internalType: 'string', type: 'string'}],
    name: 'setDaoURI',
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
    inputs: [{name: '', internalType: 'address', type: 'address'}],
    name: 'setSignatureValidator',
    outputs: [],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {name: '_newTrustedForwarder', internalType: 'address', type: 'address'},
    ],
    name: 'setTrustedForwarder',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: 'interfaceId', internalType: 'bytes4', type: 'bytes4'}],
    name: 'supportsInterface',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
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
  {type: 'receive', stateMutability: 'payable'},
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DAOFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const daoFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_registry',
        internalType: 'contract DAORegistry',
        type: 'address',
      },
      {
        name: '_pluginSetupProcessor',
        internalType: 'contract PluginSetupProcessor',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {type: 'error', inputs: [], name: 'NoPluginProvided'},
  {
    type: 'function',
    inputs: [
      {
        name: '_daoSettings',
        internalType: 'struct DAOFactory.DAOSettings',
        type: 'tuple',
        components: [
          {name: 'trustedForwarder', internalType: 'address', type: 'address'},
          {name: 'daoURI', internalType: 'string', type: 'string'},
          {name: 'subdomain', internalType: 'string', type: 'string'},
          {name: 'metadata', internalType: 'bytes', type: 'bytes'},
        ],
      },
      {
        name: '_pluginSettings',
        internalType: 'struct DAOFactory.PluginSettings[]',
        type: 'tuple[]',
        components: [
          {
            name: 'pluginSetupRef',
            internalType: 'struct PluginSetupRef',
            type: 'tuple',
            components: [
              {
                name: 'versionTag',
                internalType: 'struct PluginRepo.Tag',
                type: 'tuple',
                components: [
                  {name: 'release', internalType: 'uint8', type: 'uint8'},
                  {name: 'build', internalType: 'uint16', type: 'uint16'},
                ],
              },
              {
                name: 'pluginSetupRepo',
                internalType: 'contract PluginRepo',
                type: 'address',
              },
            ],
          },
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    name: 'createDao',
    outputs: [
      {name: 'createdDao', internalType: 'contract DAO', type: 'address'},
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'daoBase',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'daoRegistry',
    outputs: [
      {name: '', internalType: 'contract DAORegistry', type: 'address'},
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pluginSetupProcessor',
    outputs: [
      {
        name: '',
        internalType: 'contract PluginSetupProcessor',
        type: 'address',
      },
    ],
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
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DAORegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const daoRegistryAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractAlreadyRegistered',
  },
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractERC165SupportInvalid',
  },
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractInterfaceInvalid',
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
  {
    type: 'error',
    inputs: [{name: 'subdomain', internalType: 'string', type: 'string'}],
    name: 'InvalidDaoSubdomain',
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
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'subdomain',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'DAORegistered',
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
    name: 'REGISTER_DAO_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_REGISTRY_PERMISSION_ID',
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
    inputs: [{name: '', internalType: 'address', type: 'address'}],
    name: 'entries',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_managingDao', internalType: 'contract IDAO', type: 'address'},
      {
        name: '_subdomainRegistrar',
        internalType: 'contract ENSSubdomainRegistrar',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
      {name: 'dao', internalType: 'contract IDAO', type: 'address'},
      {name: 'creator', internalType: 'address', type: 'address'},
      {name: 'subdomain', internalType: 'string', type: 'string'},
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'subdomainRegistrar',
    outputs: [
      {
        name: '',
        internalType: 'contract ENSSubdomainRegistrar',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetInterfaceId',
    outputs: [{name: '', internalType: 'bytes4', type: 'bytes4'}],
    stateMutability: 'view',
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
// ENSSubdomainRegistrar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ensSubdomainRegistrarAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'error',
    inputs: [
      {name: 'subnode', internalType: 'bytes32', type: 'bytes32'},
      {name: 'nodeOwner', internalType: 'address', type: 'address'},
    ],
    name: 'AlreadyRegistered',
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
  {
    type: 'error',
    inputs: [
      {name: 'node', internalType: 'bytes32', type: 'bytes32'},
      {name: 'resolver', internalType: 'address', type: 'address'},
    ],
    name: 'InvalidResolver',
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
    name: 'REGISTER_ENS_SUBDOMAIN_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_REGISTRAR_PERMISSION_ID',
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
    inputs: [],
    name: 'ens',
    outputs: [{name: '', internalType: 'contract ENS', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_managingDao', internalType: 'contract IDAO', type: 'address'},
      {name: '_ens', internalType: 'contract ENS', type: 'address'},
      {name: '_node', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'node',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
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
      {name: '_label', internalType: 'bytes32', type: 'bytes32'},
      {name: '_targetAddress', internalType: 'address', type: 'address'},
    ],
    name: 'registerSubnode',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'resolver',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_resolver', internalType: 'address', type: 'address'}],
    name: 'setDefaultResolver',
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
// IEIP4824
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ieip4824Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'daoURI',
    outputs: [{name: '_daoURI', internalType: 'string', type: 'string'}],
    stateMutability: 'view',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IPluginRepo
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iPluginRepoAbi = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'release', internalType: 'uint8', type: 'uint8', indexed: false},
      {
        name: 'releaseMetadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'ReleaseMetadataUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'release', internalType: 'uint8', type: 'uint8', indexed: false},
      {name: 'build', internalType: 'uint16', type: 'uint16', indexed: false},
      {
        name: 'pluginSetup',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'buildMetadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'VersionCreated',
  },
  {
    type: 'function',
    inputs: [
      {name: '_release', internalType: 'uint8', type: 'uint8'},
      {name: '_pluginSetupAddress', internalType: 'address', type: 'address'},
      {name: '_buildMetadata', internalType: 'bytes', type: 'bytes'},
      {name: '_releaseMetadata', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'createVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_release', internalType: 'uint8', type: 'uint8'},
      {name: '_releaseMetadata', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'updateReleaseMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InterfaceBasedRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const interfaceBasedRegistryAbi = [
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractAlreadyRegistered',
  },
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractERC165SupportInvalid',
  },
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractInterfaceInvalid',
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
    name: 'UPGRADE_REGISTRY_PERMISSION_ID',
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
    inputs: [{name: '', internalType: 'address', type: 'address'}],
    name: 'entries',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
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
    inputs: [],
    name: 'targetInterfaceId',
    outputs: [{name: '', internalType: 'bytes4', type: 'bytes4'}],
    stateMutability: 'view',
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
// PermissionManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const permissionManagerAbi = [
  {type: 'error', inputs: [], name: 'AnyAddressDisallowedForWhoAndWhere'},
  {
    type: 'error',
    inputs: [
      {
        name: 'condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'ConditionInterfaceNotSupported',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'ConditionNotAContract',
  },
  {type: 'error', inputs: [], name: 'GrantWithConditionNotSupported'},
  {
    type: 'error',
    inputs: [
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
      {name: 'currentCondition', internalType: 'address', type: 'address'},
      {name: 'newCondition', internalType: 'address', type: 'address'},
    ],
    name: 'PermissionAlreadyGrantedForDifferentCondition',
  },
  {type: 'error', inputs: [], name: 'PermissionsForAnyAddressDisallowed'},
  {
    type: 'error',
    inputs: [
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'Unauthorized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'permissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {name: 'here', internalType: 'address', type: 'address', indexed: true},
      {name: 'where', internalType: 'address', type: 'address', indexed: false},
      {name: 'who', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'condition',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Granted',
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
        name: 'permissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {name: 'here', internalType: 'address', type: 'address', indexed: true},
      {name: 'where', internalType: 'address', type: 'address', indexed: false},
      {name: 'who', internalType: 'address', type: 'address', indexed: true},
    ],
    name: 'Revoked',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_items',
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
    name: 'applyMultiTargetPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {
        name: 'items',
        internalType: 'struct PermissionLib.SingleTargetPermission[]',
        type: 'tuple[]',
        components: [
          {
            name: 'operation',
            internalType: 'enum PermissionLib.Operation',
            type: 'uint8',
          },
          {name: 'who', internalType: 'address', type: 'address'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'applySingleTargetPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'grant',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
      {
        name: '_condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'grantWithCondition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PlaceholderSetup
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const placeholderSetupAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {type: 'error', inputs: [], name: 'NonUpgradeablePlugin'},
  {type: 'error', inputs: [], name: 'PlaceholderSetupCannotBeUsed'},
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
      {name: '', internalType: 'address', type: 'address'},
      {name: '', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'prepareInstallation',
    outputs: [
      {name: '', internalType: 'address', type: 'address'},
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
    inputs: [
      {name: '', internalType: 'address', type: 'address'},
      {
        name: '',
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
        name: '',
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PluginRepo
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pluginRepoAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {type: 'error', inputs: [], name: 'AnyAddressDisallowedForWhoAndWhere'},
  {
    type: 'error',
    inputs: [
      {
        name: 'condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'ConditionInterfaceNotSupported',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'ConditionNotAContract',
  },
  {type: 'error', inputs: [], name: 'EmptyReleaseMetadata'},
  {type: 'error', inputs: [], name: 'GrantWithConditionNotSupported'},
  {type: 'error', inputs: [], name: 'InvalidPluginSetupInterface'},
  {
    type: 'error',
    inputs: [
      {name: 'latestRelease', internalType: 'uint8', type: 'uint8'},
      {name: 'newRelease', internalType: 'uint8', type: 'uint8'},
    ],
    name: 'InvalidReleaseIncrement',
  },
  {
    type: 'error',
    inputs: [
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
      {name: 'currentCondition', internalType: 'address', type: 'address'},
      {name: 'newCondition', internalType: 'address', type: 'address'},
    ],
    name: 'PermissionAlreadyGrantedForDifferentCondition',
  },
  {type: 'error', inputs: [], name: 'PermissionsForAnyAddressDisallowed'},
  {
    type: 'error',
    inputs: [
      {name: 'release', internalType: 'uint8', type: 'uint8'},
      {name: 'build', internalType: 'uint16', type: 'uint16'},
      {name: 'pluginSetup', internalType: 'address', type: 'address'},
    ],
    name: 'PluginSetupAlreadyInPreviousRelease',
  },
  {type: 'error', inputs: [], name: 'ReleaseDoesNotExist'},
  {type: 'error', inputs: [], name: 'ReleaseZeroNotAllowed'},
  {
    type: 'error',
    inputs: [
      {name: 'where', internalType: 'address', type: 'address'},
      {name: 'who', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'Unauthorized',
  },
  {
    type: 'error',
    inputs: [{name: 'versionHash', internalType: 'bytes32', type: 'bytes32'}],
    name: 'VersionHashDoesNotExist',
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
      {
        name: 'permissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {name: 'here', internalType: 'address', type: 'address', indexed: true},
      {name: 'where', internalType: 'address', type: 'address', indexed: false},
      {name: 'who', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'condition',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'Granted',
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
      {name: 'release', internalType: 'uint8', type: 'uint8', indexed: false},
      {
        name: 'releaseMetadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'ReleaseMetadataUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'permissionId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      {name: 'here', internalType: 'address', type: 'address', indexed: true},
      {name: 'where', internalType: 'address', type: 'address', indexed: false},
      {name: 'who', internalType: 'address', type: 'address', indexed: true},
    ],
    name: 'Revoked',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'release', internalType: 'uint8', type: 'uint8', indexed: false},
      {name: 'build', internalType: 'uint16', type: 'uint16', indexed: false},
      {
        name: 'pluginSetup',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'buildMetadata',
        internalType: 'bytes',
        type: 'bytes',
        indexed: false,
      },
    ],
    name: 'VersionCreated',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAINTAINER_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'ROOT_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_REPO_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_items',
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
    name: 'applyMultiTargetPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {
        name: 'items',
        internalType: 'struct PermissionLib.SingleTargetPermission[]',
        type: 'tuple[]',
        components: [
          {
            name: 'operation',
            internalType: 'enum PermissionLib.Operation',
            type: 'uint8',
          },
          {name: 'who', internalType: 'address', type: 'address'},
          {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'applySingleTargetPermissions',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_release', internalType: 'uint8', type: 'uint8'}],
    name: 'buildCount',
    outputs: [{name: '', internalType: 'uint256', type: 'uint256'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_release', internalType: 'uint8', type: 'uint8'},
      {name: '_pluginSetup', internalType: 'address', type: 'address'},
      {name: '_buildMetadata', internalType: 'bytes', type: 'bytes'},
      {name: '_releaseMetadata', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'createVersion',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: '_pluginSetup', internalType: 'address', type: 'address'}],
    name: 'getLatestVersion',
    outputs: [
      {
        name: '',
        internalType: 'struct PluginRepo.Version',
        type: 'tuple',
        components: [
          {
            name: 'tag',
            internalType: 'struct PluginRepo.Tag',
            type: 'tuple',
            components: [
              {name: 'release', internalType: 'uint8', type: 'uint8'},
              {name: 'build', internalType: 'uint16', type: 'uint16'},
            ],
          },
          {name: 'pluginSetup', internalType: 'address', type: 'address'},
          {name: 'buildMetadata', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_release', internalType: 'uint8', type: 'uint8'}],
    name: 'getLatestVersion',
    outputs: [
      {
        name: '',
        internalType: 'struct PluginRepo.Version',
        type: 'tuple',
        components: [
          {
            name: 'tag',
            internalType: 'struct PluginRepo.Tag',
            type: 'tuple',
            components: [
              {name: 'release', internalType: 'uint8', type: 'uint8'},
              {name: 'build', internalType: 'uint16', type: 'uint16'},
            ],
          },
          {name: 'pluginSetup', internalType: 'address', type: 'address'},
          {name: 'buildMetadata', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '_tagHash', internalType: 'bytes32', type: 'bytes32'}],
    name: 'getVersion',
    outputs: [
      {
        name: '',
        internalType: 'struct PluginRepo.Version',
        type: 'tuple',
        components: [
          {
            name: 'tag',
            internalType: 'struct PluginRepo.Tag',
            type: 'tuple',
            components: [
              {name: 'release', internalType: 'uint8', type: 'uint8'},
              {name: 'build', internalType: 'uint16', type: 'uint16'},
            ],
          },
          {name: 'pluginSetup', internalType: 'address', type: 'address'},
          {name: 'buildMetadata', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_tag',
        internalType: 'struct PluginRepo.Tag',
        type: 'tuple',
        components: [
          {name: 'release', internalType: 'uint8', type: 'uint8'},
          {name: 'build', internalType: 'uint16', type: 'uint16'},
        ],
      },
    ],
    name: 'getVersion',
    outputs: [
      {
        name: '',
        internalType: 'struct PluginRepo.Version',
        type: 'tuple',
        components: [
          {
            name: 'tag',
            internalType: 'struct PluginRepo.Tag',
            type: 'tuple',
            components: [
              {name: 'release', internalType: 'uint8', type: 'uint8'},
              {name: 'build', internalType: 'uint16', type: 'uint16'},
            ],
          },
          {name: 'pluginSetup', internalType: 'address', type: 'address'},
          {name: 'buildMetadata', internalType: 'bytes', type: 'bytes'},
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'grant',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
      {
        name: '_condition',
        internalType: 'contract IPermissionCondition',
        type: 'address',
      },
    ],
    name: 'grantWithCondition',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{name: 'initialOwner', internalType: 'address', type: 'address'}],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_previousProtocolVersion',
        internalType: 'uint8[3]',
        type: 'uint8[3]',
      },
      {name: '_initData', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'initializeFrom',
    outputs: [],
    stateMutability: 'nonpayable',
  },
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
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'latestRelease',
    outputs: [{name: '', internalType: 'uint8', type: 'uint8'}],
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
      {name: '_where', internalType: 'address', type: 'address'},
      {name: '_who', internalType: 'address', type: 'address'},
      {name: '_permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'revoke',
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
    inputs: [
      {name: '_release', internalType: 'uint8', type: 'uint8'},
      {name: '_releaseMetadata', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'updateReleaseMetadata',
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
// PluginRepoFactory
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pluginRepoFactoryAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_pluginRepoRegistry',
        internalType: 'contract PluginRepoRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_subdomain', internalType: 'string', type: 'string'},
      {name: '_initialOwner', internalType: 'address', type: 'address'},
    ],
    name: 'createPluginRepo',
    outputs: [{name: '', internalType: 'contract PluginRepo', type: 'address'}],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_subdomain', internalType: 'string', type: 'string'},
      {name: '_pluginSetup', internalType: 'address', type: 'address'},
      {name: '_maintainer', internalType: 'address', type: 'address'},
      {name: '_releaseMetadata', internalType: 'bytes', type: 'bytes'},
      {name: '_buildMetadata', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'createPluginRepoWithFirstVersion',
    outputs: [
      {
        name: 'pluginRepo',
        internalType: 'contract PluginRepo',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pluginRepoBase',
    outputs: [{name: '', internalType: 'address', type: 'address'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'pluginRepoRegistry',
    outputs: [
      {name: '', internalType: 'contract PluginRepoRegistry', type: 'address'},
    ],
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
] as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PluginRepoRegistry
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pluginRepoRegistryAbi = [
  {type: 'constructor', inputs: [], stateMutability: 'nonpayable'},
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractAlreadyRegistered',
  },
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractERC165SupportInvalid',
  },
  {
    type: 'error',
    inputs: [{name: 'registrant', internalType: 'address', type: 'address'}],
    name: 'ContractInterfaceInvalid',
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
  {type: 'error', inputs: [], name: 'EmptyPluginRepoSubdomain'},
  {
    type: 'error',
    inputs: [{name: 'subdomain', internalType: 'string', type: 'string'}],
    name: 'InvalidPluginSubdomain',
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
      {
        name: 'subdomain',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'pluginRepo',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PluginRepoRegistered',
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
    name: 'REGISTER_PLUGIN_REPO_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'UPGRADE_REGISTRY_PERMISSION_ID',
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
    inputs: [{name: '', internalType: 'address', type: 'address'}],
    name: 'entries',
    outputs: [{name: '', internalType: 'bool', type: 'bool'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'contract IDAO', type: 'address'},
      {
        name: '_subdomainRegistrar',
        internalType: 'contract ENSSubdomainRegistrar',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
      {name: 'subdomain', internalType: 'string', type: 'string'},
      {name: 'pluginRepo', internalType: 'address', type: 'address'},
    ],
    name: 'registerPluginRepo',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'subdomainRegistrar',
    outputs: [
      {
        name: '',
        internalType: 'contract ENSSubdomainRegistrar',
        type: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'targetInterfaceId',
    outputs: [{name: '', internalType: 'bytes4', type: 'bytes4'}],
    stateMutability: 'view',
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
// PluginSetupProcessor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const pluginSetupProcessorAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_repoRegistry',
        internalType: 'contract PluginRepoRegistry',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'error',
    inputs: [{name: 'plugin', internalType: 'address', type: 'address'}],
    name: 'IPluginNotSupported',
  },
  {
    type: 'error',
    inputs: [
      {name: 'currentAppliedSetupId', internalType: 'bytes32', type: 'bytes32'},
      {name: 'appliedSetupId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'InvalidAppliedSetupId',
  },
  {
    type: 'error',
    inputs: [
      {
        name: 'currentVersionTag',
        internalType: 'struct PluginRepo.Tag',
        type: 'tuple',
        components: [
          {name: 'release', internalType: 'uint8', type: 'uint8'},
          {name: 'build', internalType: 'uint16', type: 'uint16'},
        ],
      },
      {
        name: 'newVersionTag',
        internalType: 'struct PluginRepo.Tag',
        type: 'tuple',
        components: [
          {name: 'release', internalType: 'uint8', type: 'uint8'},
          {name: 'build', internalType: 'uint16', type: 'uint16'},
        ],
      },
    ],
    name: 'InvalidUpdateVersion',
  },
  {type: 'error', inputs: [], name: 'PluginAlreadyInstalled'},
  {
    type: 'error',
    inputs: [{name: 'plugin', internalType: 'address', type: 'address'}],
    name: 'PluginNonupgradeable',
  },
  {
    type: 'error',
    inputs: [
      {name: 'proxy', internalType: 'address', type: 'address'},
      {name: 'implementation', internalType: 'address', type: 'address'},
      {name: 'initData', internalType: 'bytes', type: 'bytes'},
    ],
    name: 'PluginProxyUpgradeFailed',
  },
  {type: 'error', inputs: [], name: 'PluginRepoNonexistent'},
  {
    type: 'error',
    inputs: [
      {name: 'preparedSetupId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'SetupAlreadyPrepared',
  },
  {
    type: 'error',
    inputs: [
      {name: 'dao', internalType: 'address', type: 'address'},
      {name: 'caller', internalType: 'address', type: 'address'},
      {name: 'permissionId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'SetupApplicationUnauthorized',
  },
  {
    type: 'error',
    inputs: [
      {name: 'preparedSetupId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'SetupNotApplicable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {name: 'plugin', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'preparedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'appliedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'InstallationApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'preparedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'pluginSetupRepo',
        internalType: 'contract PluginRepo',
        type: 'address',
        indexed: true,
      },
      {
        name: 'versionTag',
        internalType: 'struct PluginRepo.Tag',
        type: 'tuple',
        components: [
          {name: 'release', internalType: 'uint8', type: 'uint8'},
          {name: 'build', internalType: 'uint16', type: 'uint16'},
        ],
        indexed: false,
      },
      {name: 'data', internalType: 'bytes', type: 'bytes', indexed: false},
      {
        name: 'plugin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
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
        indexed: false,
      },
    ],
    name: 'InstallationPrepared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {name: 'plugin', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'preparedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'UninstallationApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'preparedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'pluginSetupRepo',
        internalType: 'contract PluginRepo',
        type: 'address',
        indexed: true,
      },
      {
        name: 'versionTag',
        internalType: 'struct PluginRepo.Tag',
        type: 'tuple',
        components: [
          {name: 'release', internalType: 'uint8', type: 'uint8'},
          {name: 'build', internalType: 'uint16', type: 'uint16'},
        ],
        indexed: false,
      },
      {
        name: 'setupPayload',
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
        indexed: false,
      },
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
        indexed: false,
      },
    ],
    name: 'UninstallationPrepared',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {name: 'plugin', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'preparedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'appliedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
    ],
    name: 'UpdateApplied',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {name: 'sender', internalType: 'address', type: 'address', indexed: true},
      {name: 'dao', internalType: 'address', type: 'address', indexed: true},
      {
        name: 'preparedSetupId',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'pluginSetupRepo',
        internalType: 'contract PluginRepo',
        type: 'address',
        indexed: true,
      },
      {
        name: 'versionTag',
        internalType: 'struct PluginRepo.Tag',
        type: 'tuple',
        components: [
          {name: 'release', internalType: 'uint8', type: 'uint8'},
          {name: 'build', internalType: 'uint16', type: 'uint16'},
        ],
        indexed: false,
      },
      {
        name: 'setupPayload',
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
        indexed: false,
      },
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
        indexed: false,
      },
      {name: 'initData', internalType: 'bytes', type: 'bytes', indexed: false},
    ],
    name: 'UpdatePrepared',
  },
  {
    type: 'function',
    inputs: [],
    name: 'APPLY_INSTALLATION_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'APPLY_UNINSTALLATION_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'APPLY_UPDATE_PERMISSION_ID',
    outputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_params',
        internalType: 'struct PluginSetupProcessor.ApplyInstallationParams',
        type: 'tuple',
        components: [
          {
            name: 'pluginSetupRef',
            internalType: 'struct PluginSetupRef',
            type: 'tuple',
            components: [
              {
                name: 'versionTag',
                internalType: 'struct PluginRepo.Tag',
                type: 'tuple',
                components: [
                  {name: 'release', internalType: 'uint8', type: 'uint8'},
                  {name: 'build', internalType: 'uint16', type: 'uint16'},
                ],
              },
              {
                name: 'pluginSetupRepo',
                internalType: 'contract PluginRepo',
                type: 'address',
              },
            ],
          },
          {name: 'plugin', internalType: 'address', type: 'address'},
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
          {name: 'helpersHash', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'applyInstallation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_params',
        internalType: 'struct PluginSetupProcessor.ApplyUninstallationParams',
        type: 'tuple',
        components: [
          {name: 'plugin', internalType: 'address', type: 'address'},
          {
            name: 'pluginSetupRef',
            internalType: 'struct PluginSetupRef',
            type: 'tuple',
            components: [
              {
                name: 'versionTag',
                internalType: 'struct PluginRepo.Tag',
                type: 'tuple',
                components: [
                  {name: 'release', internalType: 'uint8', type: 'uint8'},
                  {name: 'build', internalType: 'uint16', type: 'uint16'},
                ],
              },
              {
                name: 'pluginSetupRepo',
                internalType: 'contract PluginRepo',
                type: 'address',
              },
            ],
          },
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
    name: 'applyUninstallation',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_params',
        internalType: 'struct PluginSetupProcessor.ApplyUpdateParams',
        type: 'tuple',
        components: [
          {name: 'plugin', internalType: 'address', type: 'address'},
          {
            name: 'pluginSetupRef',
            internalType: 'struct PluginSetupRef',
            type: 'tuple',
            components: [
              {
                name: 'versionTag',
                internalType: 'struct PluginRepo.Tag',
                type: 'tuple',
                components: [
                  {name: 'release', internalType: 'uint8', type: 'uint8'},
                  {name: 'build', internalType: 'uint16', type: 'uint16'},
                ],
              },
              {
                name: 'pluginSetupRepo',
                internalType: 'contract PluginRepo',
                type: 'address',
              },
            ],
          },
          {name: 'initData', internalType: 'bytes', type: 'bytes'},
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
          {name: 'helpersHash', internalType: 'bytes32', type: 'bytes32'},
        ],
      },
    ],
    name: 'applyUpdate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_params',
        internalType: 'struct PluginSetupProcessor.PrepareInstallationParams',
        type: 'tuple',
        components: [
          {
            name: 'pluginSetupRef',
            internalType: 'struct PluginSetupRef',
            type: 'tuple',
            components: [
              {
                name: 'versionTag',
                internalType: 'struct PluginRepo.Tag',
                type: 'tuple',
                components: [
                  {name: 'release', internalType: 'uint8', type: 'uint8'},
                  {name: 'build', internalType: 'uint16', type: 'uint16'},
                ],
              },
              {
                name: 'pluginSetupRepo',
                internalType: 'contract PluginRepo',
                type: 'address',
              },
            ],
          },
          {name: 'data', internalType: 'bytes', type: 'bytes'},
        ],
      },
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
        name: '_params',
        internalType: 'struct PluginSetupProcessor.PrepareUninstallationParams',
        type: 'tuple',
        components: [
          {
            name: 'pluginSetupRef',
            internalType: 'struct PluginSetupRef',
            type: 'tuple',
            components: [
              {
                name: 'versionTag',
                internalType: 'struct PluginRepo.Tag',
                type: 'tuple',
                components: [
                  {name: 'release', internalType: 'uint8', type: 'uint8'},
                  {name: 'build', internalType: 'uint16', type: 'uint16'},
                ],
              },
              {
                name: 'pluginSetupRepo',
                internalType: 'contract PluginRepo',
                type: 'address',
              },
            ],
          },
          {
            name: 'setupPayload',
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
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {name: '_dao', internalType: 'address', type: 'address'},
      {
        name: '_params',
        internalType: 'struct PluginSetupProcessor.PrepareUpdateParams',
        type: 'tuple',
        components: [
          {
            name: 'currentVersionTag',
            internalType: 'struct PluginRepo.Tag',
            type: 'tuple',
            components: [
              {name: 'release', internalType: 'uint8', type: 'uint8'},
              {name: 'build', internalType: 'uint16', type: 'uint16'},
            ],
          },
          {
            name: 'newVersionTag',
            internalType: 'struct PluginRepo.Tag',
            type: 'tuple',
            components: [
              {name: 'release', internalType: 'uint8', type: 'uint8'},
              {name: 'build', internalType: 'uint16', type: 'uint16'},
            ],
          },
          {
            name: 'pluginSetupRepo',
            internalType: 'contract PluginRepo',
            type: 'address',
          },
          {
            name: 'setupPayload',
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
      },
    ],
    name: 'prepareUpdate',
    outputs: [
      {name: 'initData', internalType: 'bytes', type: 'bytes'},
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
    inputs: [],
    name: 'protocolVersion',
    outputs: [{name: '', internalType: 'uint8[3]', type: 'uint8[3]'}],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'repoRegistry',
    outputs: [
      {name: '', internalType: 'contract PluginRepoRegistry', type: 'address'},
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{name: '', internalType: 'bytes32', type: 'bytes32'}],
    name: 'states',
    outputs: [
      {name: 'blockNumber', internalType: 'uint256', type: 'uint256'},
      {name: 'currentAppliedSetupId', internalType: 'bytes32', type: 'bytes32'},
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {name: 'pluginInstallationId', internalType: 'bytes32', type: 'bytes32'},
      {name: 'preparedSetupId', internalType: 'bytes32', type: 'bytes32'},
    ],
    name: 'validatePreparedSetupId',
    outputs: [],
    stateMutability: 'view',
  },
] as const;
