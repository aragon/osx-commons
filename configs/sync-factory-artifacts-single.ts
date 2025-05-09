#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env --allow-net --allow-run=cast
import {ZodError, z} from 'https://deno.land/x/zod@v3.24.4/mod.ts';

const {args: DenoArgs, env: DenoEnv, exit: DenoExit} = Deno; // Alias for clarity

if (DenoArgs.length < 2 || DenoArgs.some(arg => !arg)) {
  console.error('Usage:\ndeno script.ts <addresses_file> <output_file>');
  console.error(
    '  - <addresses_file>: Path to the JSON file containing contract addresses.'
  );
  console.error(
    '  - <output_file>: Path to the JSON file where the reconstructed deployment info will be written.'
  );
  console.error('\nRequired Environment variables:');
  console.error('  - ETHERSCAN_API_KEY: Your Etherscan API key.');
  console.error(
    '  - RPC_URL: JSON RPC URL for the network (default: http://localhost:8545).'
  );
  console.error('\nOptional Environment variables:');
  console.error(
    '  - ETHERSCAN_API_URL_BASE: Base URL for Etherscan API (default: https://api.etherscan.io for mainnet).'
  );
  console.error(
    '  - ETHERSCAN_REQUEST_DELAY_MS: Delay in ms between Etherscan API calls (default: 250).'
  );
  DenoExit(1);
}

// Constants
const ADDRESSES_FILE = DenoArgs[0];
const OUTPUT_FILE = DenoArgs[1];
const OUTPUT_VERSION_KEY = 'v1.4.0'; // Or your desired version key

const RPC_URL = DenoEnv.get('RPC_URL') || 'http://localhost:8545';
const ETHERSCAN_API_KEY = DenoEnv.get('ETHERSCAN_API_KEY');
const ETHERSCAN_API_URL_BASE =
  DenoEnv.get('ETHERSCAN_API_URL_BASE') || 'https://api.etherscan.io';
const ETHERSCAN_REQUEST_DELAY_MS = parseInt(
  DenoEnv.get('ETHERSCAN_REQUEST_DELAY_MS') || '250', // 250ms delay = 4 req/sec
  10
);

if (!ETHERSCAN_API_KEY) {
  console.error(
    'Error: ETHERSCAN_API_KEY environment variable is not set. Please provide your Etherscan API key.'
  );
  DenoExit(1);
}

// bytes32(uint256(keccak256('eip1967.proxy.implementation')) - 1)
const EIP_1967_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc';

// --- Zod Schemas ---
const HexStringSchema = z
  .string()
  .regex(/^0x[0-9a-fA-F]+$/, 'Invalid hex string');
const AddressSchema = HexStringSchema.length(42, 'Invalid address length');

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

const DeploymentOutputSchema = z.object({
  address: AddressSchema,
  blockNumber: z.number().int().positive().nullable(),
  deploymentTx: HexStringSchema.nullable(),
});
type DeploymentOutput = z.infer<typeof DeploymentOutputSchema>;

type OutputData = {
  [version: string]: {
    [contractName: string]: DeploymentOutput;
  };
};

const EtherscanContractCreationResultSchema = z.object({
  contractAddress: AddressSchema,
  contractCreator: AddressSchema,
  txHash: HexStringSchema.length(66, 'Invalid txHash length'), // 0x + 64 chars
});

const EtherscanResponseSchema = z.object({
  status: z.string(), // "1" for success, "0" for error
  message: z.string(),
  result: z.array(EtherscanContractCreationResultSchema),
});

// --- Caches ---
const blockNumberCache = new Map<string, number>();
const etherscanTxCache = new Map<string, string | null>(); // address -> txHash | null

// --- Helper Functions ---
async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function readAndParseJson<T>(
  filePath: string,
  schema: z.ZodType<T>
): Promise<T> {
  console.log(`Reading ${filePath}...`);
  try {
    const content = await Deno.readTextFile(filePath);
    const data = JSON.parse(content);
    return schema.parse(data);
  } catch (error) {
    // ... (error handling as in your original script)
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
    DenoExit(1);
  }
}

async function runCommand(cmd: string[]): Promise<string> {
  const command = new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: 'piped',
    stderr: 'piped',
  });
  const {code, stdout, stderr} = await command.output();
  const stdoutText = new TextDecoder().decode(stdout).trim();
  const stderrText = new TextDecoder().decode(stderr).trim();
  if (code !== 0) {
    const errorMsg = `Command "${cmd.join(
      ' '
    )}" failed with code ${code}. Stderr: ${stderrText}. Stdout: ${stdoutText}`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  return stdoutText;
}

async function runCastCommand(args: string[]): Promise<string> {
  try {
    return await runCommand(['cast', ...args]);
  } catch (error) {
    console.error(`Failed to execute 'cast' command: cast ${args.join(' ')}`);
    console.error(
      "Ensure 'cast' is installed and in PATH, and RPC_URL is valid."
    );
    throw error;
  }
}

function getAddressFromPath(obj: any, path: string): string | undefined {
  try {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  } catch (e) {
    return undefined;
  }
}

async function getContractCreationTxFromEtherscan(
  contractAddress: string
): Promise<string | null> {
  if (etherscanTxCache.has(contractAddress)) {
    return etherscanTxCache.get(contractAddress)!;
  }

  const url = `${ETHERSCAN_API_URL_BASE}/api?module=contract&action=getcontractcreation&contractaddresses=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
  console.log(
    url,
    `Querying Etherscan for creation TX of ${contractAddress}...`
  );

  try {
    await delay(ETHERSCAN_REQUEST_DELAY_MS); // Respect rate limits
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Etherscan API request failed with status ${
          response.status
        }: ${await response.text()}`
      );
    }
    const jsonResponse = await response.json();
    const parsed = EtherscanResponseSchema.safeParse(jsonResponse);

    if (!parsed.success) {
      console.warn(
        `Warning: Invalid Etherscan API response structure for ${contractAddress}:`,
        parsed.error.errors
      );
      etherscanTxCache.set(contractAddress, null);
      return null;
    }

    if (parsed.data.status === '0') {
      // Etherscan API returned an error or no result
      if (parsed.data.message === 'No data found') {
        console.warn(
          `Warning: Etherscan: No contract creation data found for ${contractAddress}.`
        );
      } else {
        console.warn(
          `Warning: Etherscan API error for ${contractAddress}: ${parsed.data.message}`
        );
      }
      etherscanTxCache.set(contractAddress, null);
      return null;
    }

    if (parsed.data.result.length === 0) {
      console.warn(
        `Warning: Etherscan returned no results for contract creation of ${contractAddress}.`
      );
      etherscanTxCache.set(contractAddress, null);
      return null;
    }

    // Assuming the first result is the correct one
    const txHash = parsed.data.result[0].txHash;
    console.log(` -> Found creation TX: ${txHash} for ${contractAddress}`);
    etherscanTxCache.set(contractAddress, txHash);
    return txHash;
  } catch (error) {
    console.warn(
      `Warning: Failed to fetch or parse contract creation TX for ${contractAddress} from Etherscan: ${error.message}`
    );
    etherscanTxCache.set(contractAddress, null);
    return null;
  }
}

async function getBlockNumberFromTxHash(
  txHash: string
): Promise<number | null> {
  if (blockNumberCache.has(txHash)) {
    return blockNumberCache.get(txHash)!;
  }
  console.log(`Fetching block number for TX: ${txHash} via RPC: ${RPC_URL}...`);
  try {
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
    console.log(` -> Found block number: ${blockNumber} for TX: ${txHash}`);
    return blockNumber;
  } catch (error) {
    console.warn(
      `Warning: Error fetching block number for TX ${txHash}: ${error.message}`
    );
    return null;
  }
}

// --- RPC Call Functions (Proxy Impl, Plugin Setup, etc.) ---
// These are largely the same as your original script, just ensure they are defined
async function getProxyImplementationAddress(
  proxyAddress: string
): Promise<string | undefined> {
  console.log(`Fetching implementation for proxy: ${proxyAddress}...`);
  try {
    const addressRaw = await runCastCommand([
      'storage',
      proxyAddress,
      EIP_1967_IMPLEMENTATION_SLOT,
      '--rpc-url',
      RPC_URL,
    ]);
    const address = '0x' + addressRaw.slice(-40);
    if (!AddressSchema.safeParse(address).success)
      throw new Error(`Invalid address format: ${addressRaw}`);
    console.log(` -> Found implementation via storage slot: ${address}`);
    return address;
  } catch (error) {
    console.warn(
      `Warning: Could not get proxy implementation for ${proxyAddress}: ${error.message}`
    );
    return undefined;
  }
}

async function getSetupImplementationAddress(
  pluginSetupAddress: string
): Promise<string | undefined> {
  console.log(
    `Fetching implementation for plugin setup: ${pluginSetupAddress}...`
  );
  const sig = 'implementation()(address)';
  try {
    const address = await runCastCommand([
      'call',
      pluginSetupAddress,
      sig,
      '--rpc-url',
      RPC_URL,
    ]);
    if (!AddressSchema.safeParse(address).success)
      throw new Error(`Invalid address format from call: ${address}`);
    console.log(` -> Found setup implementation via ${sig}: ${address}`);
    return address;
  } catch (error) {
    console.warn(
      `Warning: Could not get setup implementation for ${pluginSetupAddress}: ${error.message}`
    );
    return undefined;
  }
}

async function getDaoBaseAddress(
  daoFactory: string
): Promise<string | undefined> {
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
    if (!AddressSchema.safeParse(address).success)
      throw new Error(`Invalid address format from call: ${address}`);
    console.log(` -> Found daoBase via ${sig}: ${address}`);
    return address;
  } catch (error) {
    console.warn(
      `Warning: Could not get daoBase for ${daoFactory}: ${error.message}`
    );
    return undefined;
  }
}

async function getPluginSetupAddress(
  repoAddress: string
): Promise<string | undefined> {
  const releaseNumber = 1;
  console.log(
    `Fetching latest plugin setup from repo: ${repoAddress} (release ${releaseNumber})...`
  );
  const signature = 'getLatestVersion(uint8)(((uint8,uint16),address,bytes))';
  try {
    const output = await runCastCommand([
      'call',
      repoAddress,
      signature,
      releaseNumber.toString(),
      '--rpc-url',
      RPC_URL,
    ]);
    const parts = output.replace(/ /g, '').trim().split(/,/);
    if (parts.length < 3 || !AddressSchema.safeParse(parts[2]).success) {
      throw new Error(`Unexpected output format: "${output}"`);
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
    console.warn(
      `Warning: Could not get plugin setup from repo ${repoAddress}: ${error.message}`
    );
    return undefined;
  }
}

// --- Contract Mappings (same as your previous adapted script) ---
type MappingSource =
  | {type: 'factory-addresses'; path: string}
  | {type: 'proxy-implementation'; proxyTargetKey: string}
  | {type: 'setup-implementation'; setupTargetKey: string}
  | {type: 'plugin-setup-from-repo'; repoTargetKey: string}
  | {type: 'dao-base'; targetKey: string};

interface ContractMapping {
  targetKey: string; // output key
  source: MappingSource;
}

// Your contractMappings array goes here (copied from your previous script)
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
  // Base Contracts
  {targetKey: 'DAOBase', source: {type: 'dao-base', targetKey: 'DAOFactory'}},
  {
    targetKey: 'PluginRepoBase',
    source: {type: 'proxy-implementation', proxyTargetKey: 'MultisigRepoProxy'},
  }, // Assuming MultisigRepo is representative
  // Implementations
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
  // Plugin Setups
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
  // Plugin Setup Implementations
  {
    targetKey: 'AdminSetupImplementation',
    source: {type: 'setup-implementation', setupTargetKey: 'AdminSetup'},
  },
  {
    targetKey: 'MultisigSetupImplementation',
    source: {type: 'setup-implementation', setupTargetKey: 'MultisigSetup'},
  },
  {
    targetKey: 'TokenVotingSetupImplementation',
    source: {type: 'setup-implementation', setupTargetKey: 'TokenVotingSetup'},
  },
  {
    targetKey: 'StagedProposalProcessorSetupImplementation',
    source: {
      type: 'setup-implementation',
      setupTargetKey: 'StagedProposalProcessorSetup',
    },
  },
];

function sortedKeys(data: OutputData): OutputData {
  const result: OutputData = {[OUTPUT_VERSION_KEY]: {}};
  const versionData = data[OUTPUT_VERSION_KEY];
  if (!versionData) return result; // Should not happen if initialized correctly

  const keys = Object.keys(versionData);
  keys.sort((a, b) => (a.toLowerCase() > b.toLowerCase() ? 1 : -1)); // Case-insensitive sort

  for (const k of keys) {
    result[OUTPUT_VERSION_KEY][k] = versionData[k];
  }
  return result;
}

// --- Main Logic ---
async function main() {
  console.log('Starting extended network config generation...');
  console.log(`Using RPC URL: ${RPC_URL}`);
  console.log(`Using Etherscan API Base: ${ETHERSCAN_API_URL_BASE}`);
  console.log(`Etherscan request delay: ${ETHERSCAN_REQUEST_DELAY_MS}ms`);

  const addressesData = await readAndParseJson(
    ADDRESSES_FILE,
    AddressesDataSchema
  );

  const outputData: OutputData = {[OUTPUT_VERSION_KEY]: {}};
  const resolvedContracts = outputData[OUTPUT_VERSION_KEY];
  let overallSuccess = true;

  console.log('\nProcessing contract mappings...');
  for (const mapping of contractMappings) {
    const {targetKey, source} = mapping;
    console.log(`\nProcessing ${targetKey}...`);

    let address: string | undefined = undefined;
    let deploymentTx: string | null = null;
    let blockNumber: number | null = null;

    try {
      if (source.type === 'factory-addresses') {
        address = getAddressFromPath(addressesData, source.path);
        if (!address)
          throw new Error(
            `Path '${source.path}' not found in ${ADDRESSES_FILE}`
          );
      } else if (source.type === 'proxy-implementation') {
        const proxy = resolvedContracts[source.proxyTargetKey];
        if (!proxy?.address)
          throw new Error(
            `Dependency proxy '${source.proxyTargetKey}' not resolved.`
          );
        address = await getProxyImplementationAddress(proxy.address);
      } else if (source.type === 'setup-implementation') {
        const setup = resolvedContracts[source.setupTargetKey];
        if (!setup?.address)
          throw new Error(
            `Dependency setup '${source.setupTargetKey}' not resolved.`
          );
        address = await getSetupImplementationAddress(setup.address);
      } else if (source.type === 'plugin-setup-from-repo') {
        const repo = resolvedContracts[source.repoTargetKey];
        if (!repo?.address)
          throw new Error(
            `Dependency repo '${source.repoTargetKey}' not resolved.`
          );
        address = await getPluginSetupAddress(repo.address);
      } else if (source.type === 'dao-base') {
        const factory = resolvedContracts[source.targetKey];
        if (!factory?.address)
          throw new Error(
            `Dependency factory '${source.targetKey}' not resolved.`
          );
        address = await getDaoBaseAddress(factory.address);
      }

      if (!address) {
        throw new Error(
          'Failed to determine address for an unknown reason or unhandled source type.'
        );
      }

      // Now, try to get deploymentTx and blockNumber
      deploymentTx = await getContractCreationTxFromEtherscan(address);
      if (deploymentTx) {
        blockNumber = await getBlockNumberFromTxHash(deploymentTx);
      }

      resolvedContracts[targetKey] = {
        address,
        deploymentTx,
        blockNumber,
      };
      console.log(
        ` -> Added ${targetKey} (Address: ${address}, Tx: ${
          deploymentTx || 'N/A'
        }, Block: ${blockNumber || 'N/A'})`
      );
    } catch (error) {
      console.error(` 🛑 FAILED processing ${targetKey}: ${error.message}`);
      // Store with nulls if address was found but further steps failed
      if (address && !resolvedContracts[targetKey]) {
        resolvedContracts[targetKey] = {
          address,
          deploymentTx: null,
          blockNumber: null,
        };
        console.log(
          ` -> Partially added ${targetKey} (Address: ${address}, Tx: N/A, Block: N/A) due to error.`
        );
      }
      overallSuccess = false; // Mark that at least one contract had an issue
    }
  }

  console.log(`\nWriting output to ${OUTPUT_FILE}...`);
  try {
    await Deno.writeTextFile(
      OUTPUT_FILE,
      JSON.stringify(sortedKeys(outputData), null, 2)
    );
    console.log('Network config generation complete.');
    if (!overallSuccess) {
      console.warn(
        '\nWarning: Some contracts could not be fully processed. Check logs above.'
      );
    }
  } catch (error) {
    console.error(`Error writing output file ${OUTPUT_FILE}:`, error);
    DenoExit(1);
  }
}

if (import.meta.main) {
  await main();
}
