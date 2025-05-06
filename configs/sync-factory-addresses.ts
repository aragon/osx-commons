#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-run=cast
import {ZodError, z} from 'https://deno.land/x/zod@v3.24.4/mod.ts';

if (Deno.args.length < 3 || Deno.args.some(arg => !arg)) {
  console.error(
    'Usage:\ndeno script.ts <addresses_file> <run_file> <output_file>'
  );
  console.error(
    '  - <addresses_file>: Path to the artifacts-<network>-<timestamp>.json file on the factory repo.'
  );
  console.error(
    '  - <run_file>: Path to the broadcast/*/<network>/run-<timestamp>.json file on the factory repo.'
  );
  console.error(
    '  - <output_file>: Path to the <network>.json file where the contents will be written.'
  );
  console.error('\nEnvironment variables:');
  console.error(
    '  - RPC_URL: JSON RPC URL used to fetch the contract implementations (default: http://localhost:8545)'
  );
  Deno.exit(1);
}

// Constants
const ADDRESSES_FILE = Deno.args[0]; // 'addresses.json'
const RUN_LATEST_FILE = Deno.args[1]; // 'run-latest.json'
const OUTPUT_FILE = Deno.args[2]; // 'network-name.json'
const OUTPUT_VERSION_KEY = 'v1.4.0';
const RPC_URL = Deno.env.get('RPC_URL') || 'http://localhost:8545';

// bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)
const EIP_1967_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

// Data schemas

const HexStringSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]+$/, 'Invalid hex string');

const AddressSchema = HexStringSchema;

const AddressesDataSchema = z.object({
  corePlugins: z.object({
    adminPluginRepo: AddressSchema,
    multisigPluginRepo: AddressSchema,
    stagedProposalProcessorPluginRepo: AddressSchema,
    tokenVotingPluginRepo: AddressSchema,
  }),
  ens: z.object({
    daoSubdomainRegistrar: AddressSchema,
    ensRegistry: AddressSchema,
    pluginSubdomainRegistrar: AddressSchema,
    publicResolver: AddressSchema,
  }),
  osx: z.object({
    daoFactory: AddressSchema,
    daoRegistry: AddressSchema,
    globalExecutor: AddressSchema,
    managementDao: AddressSchema,
    managementDaoMultisig: AddressSchema,
    placeholderSetup: AddressSchema,
    pluginRepoFactory: AddressSchema,
    pluginRepoRegistry: AddressSchema,
    pluginSetupProcessor: AddressSchema,
  }),
  protocolFactory: AddressSchema,
});
// type AddressesData = z.infer<typeof AddressesDataSchema>;

const TransactionSchema = z.object({
  hash: HexStringSchema,
  transactionType: z.string(),
  contractName: z.string().nullable(),
  contractAddress: AddressSchema,
  function: z.string().nullable(),
  arguments: z.array(z.string()).nullable(),
  transaction: z.object({
    from: AddressSchema,
    gas: HexStringSchema,
    value: HexStringSchema,
    input: HexStringSchema,
    nonce: HexStringSchema,
    chainId: HexStringSchema.or(z.number()),
  }),
  additionalContracts: z.array(
    z.object({
      transactionType: z.string(),
      address: z.string(),
      initCode: z.string(),
    })
  ),
  isFixedGasLimit: z.boolean(),
});
type Transaction = z.infer<typeof TransactionSchema>;

const FoundryDeploymentSchema = z.object({
  transactions: z.array(TransactionSchema),
});
type FoundryDepoyment = z.infer<typeof FoundryDeploymentSchema>;

const DeploymentOutputSchema = z.object({
  address: AddressSchema,
  blockNumber: z.number().int().positive(),
  deploymentTx: HexStringSchema,
});
type DeploymentOutput = z.infer<typeof DeploymentOutputSchema>;

type OutputData = {
  [version: string]: {
    [contractName: string]: DeploymentOutput;
  };
};

// HELPERS

/** Safely reads and parses JSON file with Zod validation */
async function readAndParseJson<T>(
  filePath: string,
  schema: z.ZodType<T>
): Promise<T> {
  console.log(`Reading ${filePath}...`);
  try {
    const content = await Deno.readTextFile(filePath);
    const data = JSON.parse(content);
    return schema.parse(data); // Validate data structure
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`Error: File not found at ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.error(`Error: Invalid JSON in ${filePath}`);
    } else if (error instanceof ZodError) {
      console.error(`Error: Invalid data structure in ${filePath}:`);
      console.error(error.errors);
    } else {
      console.error(`Error reading or parsing ${filePath}:`, error);
    }
    Deno.exit(1);
  }
}

/** Runs a command and returns its trimmed stdout */
async function runCommand(cmd: string[]): Promise<string> {
  // console.log(`Running: ${cmd.join(" ")}`);
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: 'piped',
    stderr: 'piped',
  });
  const {code, stdout, stderr} = await command.output();
  const stdoutText = new TextDecoder().decode(stdout).trim();
  const stderrText = new TextDecoder().decode(stderr).trim();

  if (code !== 0) {
    console.error(`Error executing command: ${cmd.join(' ')}`);
    console.error(`Exit Code: ${code}`);
    if (stderrText) console.error(`Stderr: ${stderrText}`);
    if (stdoutText) console.error(`Stdout: ${stdoutText}`);
    throw new Error(`Command failed with code ${code}`);
  }

  // console.log(`Output: ${stdoutText}`);
  return stdoutText;
}

/** Executes a 'cast' command */
async function runCastCommand(args: string[]): Promise<string> {
  try {
    return runCommand(['cast', ...args]);
  } catch (error) {
    console.error(`Failed to execute 'cast' command.`);
    console.error(
      "Please ensure 'cast' (from Foundry) is installed and in your PATH."
    );
    console.error(`Attempted command: cast ${args.join(' ')}`);
    console.error('Original error:', error.message);
    throw error;
  }
}

/** Finds transaction details by the deployed contract address */
function findDeploymentTransactionByAddress(
  runData: FoundryDepoyment,
  address: string
): Transaction | undefined {
  const lowerCaseAddress = address.toLowerCase();
  return runData.transactions.find(
    tx =>
      tx.contractAddress.toLowerCase() === lowerCaseAddress ||
      tx.additionalContracts.some(
        c => c.address.toLowerCase() === lowerCaseAddress
      )
  );
}

/** Finds transaction details by the contract name (case-insensitive) */
function findTxDetailsByName(
  runData: FoundryDepoyment,
  name: string
): Transaction | undefined {
  const lowerCaseName = name.toLowerCase();

  return runData.transactions.find(
    tx =>
      tx.contractName &&
      tx.contractName.toLowerCase() === lowerCaseName &&
      tx.transactionType === 'CREATE'
  );
}

/** Gets value from nested object using dot notation path */
function getAddressFromPath(obj: any, path: string): string | undefined {
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  } catch (e) {
    return undefined;
  }
}

/** Cache for block numbers to avoid redundant RPC calls */
const blockNumberCache = new Map<string, number>();

/** Gets block number for a transaction hash using cast, with caching */
async function getBlockNumber(txHash: string): Promise<number> {
  if (blockNumberCache.has(txHash)) {
    return blockNumberCache.get(txHash)!;
  }

  console.log(`Fetching block number for tx: ${txHash}...`);
  try {
    // `cast receipt <txHash> blockNumber` is generally the most reliable
    const output = await runCastCommand([
      'receipt',
      txHash,
      'blockNumber',
      '--rpc-url',
      RPC_URL,
    ]);
    const blockNumber = parseInt(output, output.startsWith('0x') ? 16 : 10);

    if (isNaN(blockNumber)) {
      throw new Error(`Invalid block number received from cast: ${output}`);
    }

    blockNumberCache.set(txHash, blockNumber);
    return blockNumber;
  } catch (error) {
    console.error(
      `Error fetching block number for tx ${txHash}:`,
      error.message
    );
    throw error;
  }
}

/** Gets the implementation address from a proxy contract */
async function getProxyImplementationAddress(
  proxyAddress: string
): Promise<string> {
  console.log(`Fetching implementation for proxy: ${proxyAddress}...`);

  try {
    const addressRaw = await runCastCommand([
      'storage',
      proxyAddress,
      EIP_1967_IMPLEMENTATION_SLOT,
      '--rpc-url',
      RPC_URL,
    ]);
    // The result is a 32-byte slot, the address is the last 20 bytes (40 hex chars)
    const address = '0x' + addressRaw.slice(-40);
    if (!address || address.length !== 42 || !address.startsWith('0x')) {
      throw new Error(
        `Invalid address format received from storage slot: ${addressRaw}`
      );
    }
    console.log(` -> Found implementation via storage slot: ${address}`);
    return address;
  } catch (nestedError) {
    console.error(
      `Error fetching implementation for ${proxyAddress} via both methods:`,
      nestedError.message
    );
    throw new Error(
      `Could not determine implementation address for ${proxyAddress}`
    );
  }
}

/** Gets the implementation address from a proxy contract using EIP-1967 slot or common functions */
async function getSetupImplementationAddress(
  pluginSetupAddress: string
): Promise<string> {
  console.log(`Fetching implementation for proxy: ${pluginSetupAddress}...`);

  const sig = 'implementation()(address)';

  try {
    const address = await runCastCommand([
      'call',
      pluginSetupAddress,
      sig,
      '--rpc-url',
      RPC_URL,
    ]);

    if (!address || !address.startsWith('0x') || address.length !== 42) {
      throw new Error(
        `Could not determine implementation address for ${pluginSetupAddress}`
      );
    }

    console.log(` -> Found implementation via ${sig}: ${address}`);
    return address;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** Gets the implementation address from a proxy contract using EIP-1967 slot or common functions */
async function getDaoBaseAddress(daoFactory: string): Promise<string> {
  console.log(`Fetching daoBase for factory: ${daoFactory}...`);

  const sig = 'daoBase()(address)';

  try {
    const address = await runCastCommand([
      'call',
      daoFactory,
      sig,
      '--rpc-url',
      RPC_URL,
    ]);

    if (!address || !address.startsWith('0x') || address.length !== 42) {
      throw new Error(`Could not determine daoBase address for ${daoFactory}`);
    }

    console.log(` -> Found daoBase via ${sig}: ${address}`);
    return address;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/** Gets the latest plugin setup implementation address from a PluginRepo using getLatestVersion(1) */
async function getPluginSetupAddress(repoAddress: string): Promise<string> {
  const releaseNumber = 1;
  console.log(
    `Fetching latest plugin setup implementation from repo: ${repoAddress} using getLatestVersion(${releaseNumber})...`
  );

  // struct Tag { uint8 release; uint16 build; }
  // struct Version { Tag tag; address pluginSetup; bytes buildMetadata; }
  // function getLatestVersion(uint8 _release) public view returns (Version memory);
  const signature = 'getLatestVersion(uint8)(((uint8,uint16),address,bytes))';
  const argument = releaseNumber.toString();

  try {
    const output = await runCastCommand([
      'call',
      repoAddress,
      signature,
      argument,
      '--rpc-url',
      RPC_URL,
    ]);
    // Output: "((1, 5), 0xPluginSetupAddress, 0xBytes)"
    const parts = output.replace(/ /g, '').trim().split(/,/);

    // Basic validation
    if (
      parts.length < 3 ||
      !parts[2] ||
      !parts[2].startsWith('0x') ||
      parts[2].length !== 42
    ) {
      throw new Error(
        `Unexpected output format from ${signature} for repo ${repoAddress} with release ${releaseNumber}. Output: "${output}"`
      );
    }

    const address = parts[2];
    if (
      address.toLowerCase() === '0x0000000000000000000000000000000000000000'
    ) {
      throw new Error(
        `Repo ${repoAddress} returned zero address for getLatestVersion(${releaseNumber}) pluginSetup.`
      );
    }

    console.log(
      ` -> Found setup implementation via getLatestVersion(${releaseNumber}): ${address}`
    );
    return address;
  } catch (error) {
    console.error(
      `Error fetching latest setup implementation from repo ${repoAddress} using getLatestVersion(${releaseNumber}):`,
      error.message
    );
    if (error instanceof Error && error.message.includes('Command failed')) {
      console.error(
        ` -> Check if repo ${repoAddress} exists, is a valid PluginRepo, has the '${signature}' function, and has a build for release ${releaseNumber}.`
      );
    }
    throw new Error(
      `Could not determine latest setup implementation for repo ${repoAddress} (release ${releaseNumber})`
    );
  }
}

// Contract mapping types

type MappingSource =
  | {type: 'factory-addresses'; path: string}
  | {type: 'proxy-implementation'; proxyTargetKey: string}
  | {type: 'setup-implementation'; setupTargetKey: string}
  | {type: 'plugin-setup-from-repo'; repoTargetKey: string}
  | {type: 'lookup-by-name'; contractName: string}
  | {type: 'dao-base'; targetKey: string};

interface ContractMapping {
  targetKey: string; // output key
  source: MappingSource;
}

const contractMappings: ContractMapping[] = [
  // ENS Core
  {
    targetKey: 'ENSRegistry',
    source: {type: 'factory-addresses', path: 'ens.ensRegistry'},
  },
  {
    targetKey: 'PublicResolver',
    source: {type: 'factory-addresses', path: 'ens.publicResolver'},
  },

  // OSx Core Proxies & Factory
  {
    targetKey: 'ManagementDAOProxy',
    source: {type: 'factory-addresses', path: 'osx.managementDao'},
  },
  {
    targetKey: 'ManagementDAOMultisigProxy',
    source: {type: 'factory-addresses', path: 'osx.managementDaoMultisig'},
  },
  {
    targetKey: 'DAORegistryProxy',
    source: {type: 'factory-addresses', path: 'osx.daoRegistry'},
  },
  {
    targetKey: 'PluginRepoRegistryProxy',
    source: {type: 'factory-addresses', path: 'osx.pluginRepoRegistry'},
  },
  {
    targetKey: 'PluginRepoFactory',
    source: {type: 'factory-addresses', path: 'osx.pluginRepoFactory'},
  },
  {
    targetKey: 'DAOFactory',
    source: {type: 'factory-addresses', path: 'osx.daoFactory'},
  },
  {
    targetKey: 'PluginSetupProcessor',
    source: {type: 'factory-addresses', path: 'osx.pluginSetupProcessor'},
  },
  {
    targetKey: 'Executor',
    source: {type: 'factory-addresses', path: 'osx.globalExecutor'},
  },
  {
    targetKey: 'PlaceholderSetup',
    source: {type: 'factory-addresses', path: 'osx.placeholderSetup'},
  },

  // ENS Registrar Proxies
  {
    targetKey: 'DAOENSSubdomainRegistrarProxy',
    source: {type: 'factory-addresses', path: 'ens.daoSubdomainRegistrar'},
  },
  {
    targetKey: 'PluginENSSubdomainRegistrarProxy',
    source: {type: 'factory-addresses', path: 'ens.pluginSubdomainRegistrar'},
  },

  // Core Plugin Repo Proxies
  {
    targetKey: 'AdminRepoProxy',
    source: {type: 'factory-addresses', path: 'corePlugins.adminPluginRepo'},
  },
  {
    targetKey: 'MultisigRepoProxy',
    source: {type: 'factory-addresses', path: 'corePlugins.multisigPluginRepo'},
  },
  {
    targetKey: 'TokenVotingRepoProxy',
    source: {
      type: 'factory-addresses',
      path: 'corePlugins.tokenVotingPluginRepo',
    },
  },
  {
    targetKey: 'StagedProposalProcessorRepoProxy',
    source: {
      type: 'factory-addresses',
      path: 'corePlugins.stagedProposalProcessorPluginRepo',
    },
  },

  // Base Contracts (Lookup by name - assuming unique CREATE entries in run-latest)
  // Note: These might need more robust identification if names clash or deployments are complex
  {
    targetKey: 'DAOBase',
    source: {
      type: 'dao-base',
      targetKey: 'DAOFactory',
    },
  },
  {
    targetKey: 'PluginRepoBase',
    source: {
      type: 'proxy-implementation',
      proxyTargetKey: 'MultisigRepoProxy',
    },
  },

  // Implementations (depend on Proxies being processed first)
  {
    targetKey: 'ManagementDAOImplementation',
    source: {
      type: 'proxy-implementation',
      proxyTargetKey: 'ManagementDAOProxy',
    },
  },
  {
    targetKey: 'ManagementDAOMultisigImplementation',
    source: {
      type: 'proxy-implementation',
      proxyTargetKey: 'ManagementDAOMultisigProxy',
    },
  },
  {
    targetKey: 'DAORegistryImplementation',
    source: {type: 'proxy-implementation', proxyTargetKey: 'DAORegistryProxy'},
  },
  {
    targetKey: 'PluginRepoRegistryImplementation',
    source: {
      type: 'proxy-implementation',
      proxyTargetKey: 'PluginRepoRegistryProxy',
    },
  },
  {
    targetKey: 'DAOENSSubdomainRegistrarImplementation',
    source: {
      type: 'proxy-implementation',
      proxyTargetKey: 'DAOENSSubdomainRegistrarProxy',
    },
  },
  {
    targetKey: 'PluginENSSubdomainRegistrarImplementation',
    source: {
      type: 'proxy-implementation',
      proxyTargetKey: 'PluginENSSubdomainRegistrarProxy',
    },
  },

  // Plugin Setup's (depend on Repos being processed first)
  {
    targetKey: 'AdminSetup',
    source: {type: 'plugin-setup-from-repo', repoTargetKey: 'AdminRepoProxy'},
  },
  {
    targetKey: 'MultisigSetup',
    source: {
      type: 'plugin-setup-from-repo',
      repoTargetKey: 'MultisigRepoProxy',
    },
  },
  {
    targetKey: 'TokenVotingSetup',
    source: {
      type: 'plugin-setup-from-repo',
      repoTargetKey: 'TokenVotingRepoProxy',
    },
  },
  {
    targetKey: 'StagedProposalProcessorSetup',
    source: {
      type: 'plugin-setup-from-repo',
      repoTargetKey: 'StagedProposalProcessorRepoProxy',
    },
  },

  // Plugin Setup Implementations (depend on Repos being processed first)
  {
    targetKey: 'AdminSetupImplementation',
    source: {type: 'setup-implementation', setupTargetKey: 'AdminSetup'},
  },
  {
    targetKey: 'MultisigSetupImplementation',
    source: {
      type: 'setup-implementation',
      setupTargetKey: 'MultisigSetup',
    },
  },
  {
    targetKey: 'TokenVotingSetupImplementation',
    source: {
      type: 'setup-implementation',
      setupTargetKey: 'TokenVotingSetup',
    },
  },
  {
    targetKey: 'StagedProposalProcessorSetupImplementation',
    source: {
      type: 'setup-implementation',
      setupTargetKey: 'StagedProposalProcessorSetup',
    },
  },

  // Supporting Contracts (Lookup by name)
  {
    targetKey: 'GovernanceERC20',
    source: {type: 'lookup-by-name', contractName: 'GovernanceERC20'},
  },
  {
    targetKey: 'GovernanceWrappedERC20',
    source: {
      type: 'lookup-by-name',
      contractName: 'GovernanceWrappedERC20',
    },
  },
];

function sortedKeys(data: OutputData): OutputData {
  const result = {[OUTPUT_VERSION_KEY]: {}};
  const keys = Object.keys(data[OUTPUT_VERSION_KEY]);
  keys.sort((a, b) => (b > a ? -1 : 1));

  for (const k of keys) {
    result[OUTPUT_VERSION_KEY][k] = data[OUTPUT_VERSION_KEY][k];
  }

  return result;
}

// MAIN

async function main() {
  console.log('Starting network config generation...');
  console.log(`Using RPC URL: ${RPC_URL}`);

  // Input
  const addressesData = await readAndParseJson(
    ADDRESSES_FILE,
    AddressesDataSchema
  );
  const runLatestData = await readAndParseJson(
    RUN_LATEST_FILE,
    FoundryDeploymentSchema
  );

  // Output
  const outputData: OutputData = {[OUTPUT_VERSION_KEY]: {}};
  const resolvedContracts = outputData[OUTPUT_VERSION_KEY];

  // Mappings
  console.log('\nProcessing contract mappings...');
  for (const mapping of contractMappings) {
    const {targetKey, source} = mapping;
    console.log(`\nProcessing ${targetKey}...`);

    let address: string | undefined = undefined;
    let sourceDescription: string = '';

    try {
      if (source.type === 'factory-addresses') {
        address = getAddressFromPath(addressesData, source.path);
        sourceDescription = `from addresses.json path '${source.path}'`;
        if (!address)
          throw new Error(
            `Path '${source.path}' not found in ${ADDRESSES_FILE}`
          );
      } else if (source.type === 'proxy-implementation') {
        const proxyContract = resolvedContracts[source.proxyTargetKey];
        if (!proxyContract || !proxyContract.address) {
          throw new Error(
            `Dependency error: Proxy '${source.proxyTargetKey}' not resolved yet.`
          );
        }
        address = await getProxyImplementationAddress(proxyContract.address);
        sourceDescription = `implementation of ${source.proxyTargetKey} (${proxyContract.address})`;
      } else if (source.type === 'setup-implementation') {
        const setupContract = resolvedContracts[source.setupTargetKey];
        if (!setupContract || !setupContract.address) {
          throw new Error(
            `Dependency error: Proxy '${source.setupTargetKey}' not resolved yet.`
          );
        }
        address = await getSetupImplementationAddress(setupContract.address);
        sourceDescription = `plugin of ${source.setupTargetKey} (${setupContract.address})`;
      } else if (source.type === 'plugin-setup-from-repo') {
        const repoContract = resolvedContracts[source.repoTargetKey];
        if (!repoContract || !repoContract.address) {
          throw new Error(
            `Dependency error: Repo '${source.repoTargetKey}' not resolved yet.`
          );
        }
        address = await getPluginSetupAddress(repoContract.address);
        sourceDescription = `latest setup from repo ${source.repoTargetKey} (${repoContract.address})`;
      } else if (source.type === 'lookup-by-name') {
        const txDetails = findTxDetailsByName(
          runLatestData,
          source.contractName
        );
        if (!txDetails) {
          throw new Error(
            `Could not find deployment transaction for contract name '${source.contractName}' in ${RUN_LATEST_FILE}`
          );
        }
        address = txDetails.contractAddress;
        sourceDescription = `lookup by name '${source.contractName}' in ${RUN_LATEST_FILE}`;
      } else if (source.type === 'dao-base') {
        const daoFactory = resolvedContracts[source.targetKey];
        if (!daoFactory || !daoFactory.address) {
          throw new Error(
            `Dependency error: Repo '${source.targetKey}' not resolved yet.`
          );
        }
        address = await getDaoBaseAddress(daoFactory.address);
        sourceDescription = `daoBase() from repo ${source.targetKey} (${daoFactory.address})`;
      }

      if (!address) {
        throw new Error('Failed to determine address.');
      }

      // Transaction hash + block number
      const txDetails = findDeploymentTransactionByAddress(
        runLatestData,
        address
      );
      if (!txDetails) {
        throw new Error(
          `Could not find deployment transaction for address ${address} (${sourceDescription}) in ${RUN_LATEST_FILE}`
        );
      }

      const deploymentTx = txDetails.hash;
      const blockNumber = await getBlockNumber(deploymentTx);

      resolvedContracts[targetKey] = {
        address: address,
        blockNumber: blockNumber,
        deploymentTx: deploymentTx,
      };
      console.log(
        ` -> Added ${targetKey} (Address: ${address}, Tx: ${deploymentTx}, Block: ${blockNumber})`
      );
    } catch (error) {
      console.error(` !! FAILED processing ${targetKey}: ${error.message}`);
    }
  }

  // 4. Write Output File
  console.log(`\nWriting output to ${OUTPUT_FILE}...`);
  try {
    await Deno.writeTextFile(
      OUTPUT_FILE,
      JSON.stringify(sortedKeys(outputData), null, 2)
    );
    console.log('Network config generation complete');
  } catch (error) {
    console.error(`Error writing output file ${OUTPUT_FILE}:`, error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await main();
}
