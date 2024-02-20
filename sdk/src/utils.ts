import {ADDITIONAL_NETWORKS, LIVE_CONTRACTS} from './constants';
import {bytesToHex, hexToBytes} from './encoding';
import {
  InstallationNotFoundError,
  InvalidAddressError,
  InvalidVersionError,
  PluginInstallationPreparationError,
  PluginUpdatePreparationError,
  UnsupportedNetworkError,
} from './errors';
import {findEventTopicLog} from './events';
import {
  IClientGraphQLCore,
  IClientWeb3Core,
  SubgraphPluginInstallation,
} from './internal';
import {QueryIPlugin} from './internal/graphql-queries';
import {getNamedTypesFromMetadata} from './metadata';
import {
  GasFeeEstimation,
  PrepareInstallationParams,
  PrepareInstallationStep,
  PrepareInstallationStepValue,
  PrepareUpdateParams,
  PrepareUpdateStep,
  PrepareUpdateStepValue,
  SupportedNetwork,
  SupportedVersion,
} from './types';
import {
  PluginRepo__factory,
  PluginSetupProcessor,
  PluginSetupProcessor__factory,
} from '@aragon/osx-ethers';
import {FunctionFragment, Interface} from '@ethersproject/abi';
import {defaultAbiCoder} from '@ethersproject/abi';
import {isAddress} from '@ethersproject/address';
import {Network} from '@ethersproject/networks';
import {
  getNetwork as ethersGetNetwork,
  Networkish,
} from '@ethersproject/providers';

/**
 * Gets a function fragment from encoded data
 *
 * @export
 * @param {Uint8Array} data
 * @param {string[]} availableFunctions
 * @return {*}  {FunctionFragment}
 */
export function getFunctionFragment(
  data: Uint8Array,
  availableFunctions: string[]
): FunctionFragment {
  const hexBytes = bytesToHex(data);
  const iface = new Interface(availableFunctions);
  return iface.getFunction(hexBytes.substring(0, 10));
}

/**
 * Gets the named types from a metadata abi input
 *
 * @export
 * @param {IClientWeb3Core} web3
 * @param {PrepareInstallationParams} params
 * @return {*}
 */
export async function prepareGenericInstallationEstimation(
  web3: IClientWeb3Core,
  params: PrepareInstallationParams
) {
  const provider = web3.getProvider();
  if (!isAddress(params.pluginRepo)) {
    throw new InvalidAddressError();
  }
  const networkName = (await provider.getNetwork()).name as SupportedNetwork;
  let version = params.version;
  // if version is not specified install latest version
  if (!version) {
    const pluginRepo = PluginRepo__factory.connect(params.pluginRepo, provider);
    const currentRelease = await pluginRepo.latestRelease();
    const latestVersion = await pluginRepo['getLatestVersion(uint8)'](
      currentRelease
    );
    version = latestVersion.tag;
  }
  // encode installation params
  const {installationParams = [], installationAbi = []} = params;
  const data = defaultAbiCoder.encode(
    getNamedTypesFromMetadata(installationAbi),
    installationParams
  );
  // connect to psp contract
  const pspContract = PluginSetupProcessor__factory.connect(
    LIVE_CONTRACTS[SupportedVersion.LATEST][networkName]
      .pluginSetupProcessorAddress,
    provider
  );

  const gasEstimation = await pspContract.estimateGas.prepareInstallation(
    params.daoAddressOrEns,
    {
      pluginSetupRef: {
        pluginSetupRepo: params.pluginRepo,
        versionTag: version,
      },
      data,
    }
  );
  return web3.getApproximateGasFee(gasEstimation.toBigInt());
}

/**
 * Prepares an installation of a plugin
 *
 * @export
 * @param {IClientWeb3Core} web3
 * @param {(PrepareInstallationParams & { pluginSetupProcessorAddress: string })} params
 * @return {*}  {AsyncGenerator<PrepareInstallationStepValue>}
 */
export async function* prepareGenericInstallation(
  web3: IClientWeb3Core,
  params: PrepareInstallationParams & {pluginSetupProcessorAddress: string}
): AsyncGenerator<PrepareInstallationStepValue> {
  const signer = web3.getConnectedSigner();
  if (!isAddress(params.pluginRepo)) {
    throw new InvalidAddressError();
  }
  let version = params.version;
  // if version is not specified install latest version
  if (!version) {
    const pluginRepo = PluginRepo__factory.connect(params.pluginRepo, signer);
    const currentRelease = await pluginRepo.latestRelease();
    const latestVersion = await pluginRepo['getLatestVersion(uint8)'](
      currentRelease
    );
    version = latestVersion.tag;
  }
  // encode installation params
  const {installationParams = [], installationAbi = []} = params;
  const data = defaultAbiCoder.encode(
    getNamedTypesFromMetadata(installationAbi),
    installationParams
  );
  // connect to psp contract
  const pspContract = PluginSetupProcessor__factory.connect(
    params.pluginSetupProcessorAddress,
    signer
  );
  const tx = await pspContract.prepareInstallation(params.daoAddressOrEns, {
    pluginSetupRef: {
      pluginSetupRepo: params.pluginRepo,
      versionTag: version,
    },
    data,
  });

  yield {
    key: PrepareInstallationStep.PREPARING,
    txHash: tx.hash,
  };
  const cr = await tx.wait();
  const event = findEventTopicLog(
    cr,
    PluginSetupProcessor__factory.createInterface(),
    'InstallationPrepared'
  );
  const pluginAddress = event.args['plugin'];
  const preparedSetupData = event.args['preparedSetupData'];
  if (!(pluginAddress || preparedSetupData)) {
    throw new PluginInstallationPreparationError();
  }
  yield {
    key: PrepareInstallationStep.DONE,
    pluginAddress,
    pluginRepo: params.pluginRepo,
    versionTag: version,
    permissions: preparedSetupData.permissions,
    helpers: preparedSetupData.helpers,
  };
}

/**
 * Gets the parameters to be given when preparing an update
 *
 * @param {IClientGraphQLCore} graphql
 * @param {PrepareUpdateParams} params
 * @return {*}  {Promise<PluginSetupProcessor.PrepareUpdateParamsStruct>}
 */
async function getPrepareUpdateParams(
  graphql: IClientGraphQLCore,
  params: PrepareUpdateParams
): Promise<PluginSetupProcessor.PrepareUpdateParamsStruct> {
  type T = {
    iplugin: {installations: SubgraphPluginInstallation[]};
  };
  const {iplugin} = await graphql.request<T>({
    query: QueryIPlugin,
    params: {
      address: params.pluginAddress.toLowerCase(),
      where: {dao: params.daoAddressOrEns.toLowerCase()},
    },
    name: 'plugin',
  });

  // filter specified installation
  const {pluginInstallationIndex = 0} = params;
  const selectedInstallation = iplugin.installations[pluginInstallationIndex];
  if (!selectedInstallation) {
    throw new InstallationNotFoundError();
  }
  // check if version is valid
  if (
    params.newVersion.release !==
      selectedInstallation.appliedVersion.release.release ||
    params.newVersion.build <= selectedInstallation.appliedVersion.build
  ) {
    throw new InvalidVersionError();
  }
  // encode update params
  const {updateParams = [], updateAbi = []} = params;
  const data = defaultAbiCoder.encode(
    getNamedTypesFromMetadata(updateAbi),
    updateParams
  );
  return {
    currentVersionTag: {
      build: selectedInstallation.appliedVersion.build,
      release: selectedInstallation.appliedVersion.release.release,
    },
    newVersionTag: params.newVersion,
    pluginSetupRepo: params.pluginRepo,
    setupPayload: {
      plugin: params.pluginAddress,
      currentHelpers: selectedInstallation.appliedPreparation.helpers,
      data,
    },
  };
}

/**
 * Gets an estimation of the gas fee of preparing an update
 *
 * @export
 * @param {IClientWeb3Core} web3
 * @param {IClientGraphQLCore} graphql
 * @param {(PrepareUpdateParams & { pluginSetupProcessorAddress: string })} params
 * @return {*}  {Promise<GasFeeEstimation>}
 */
export async function prepareGenericUpdateEstimation(
  web3: IClientWeb3Core,
  graphql: IClientGraphQLCore,
  params: PrepareUpdateParams & {pluginSetupProcessorAddress: string}
): Promise<GasFeeEstimation> {
  const signer = web3.getConnectedSigner();
  const prepareUpdateParams = await getPrepareUpdateParams(graphql, params);
  // connect to psp contract
  const pspContract = PluginSetupProcessor__factory.connect(
    params.pluginSetupProcessorAddress,
    signer
  );
  const gasEstimation = await pspContract.estimateGas.prepareUpdate(
    params.daoAddressOrEns,
    prepareUpdateParams
  );
  return web3.getApproximateGasFee(gasEstimation.toBigInt());
}

export async function* prepareGenericUpdate(
  web3: IClientWeb3Core,
  graphql: IClientGraphQLCore,
  params: PrepareUpdateParams & {
    pluginSetupProcessorAddress: string;
  }
): AsyncGenerator<PrepareUpdateStepValue> {
  const signer = web3.getConnectedSigner();
  const prepareUpdateParams = await getPrepareUpdateParams(graphql, params);
  // connect to psp contract
  const pspContract = PluginSetupProcessor__factory.connect(
    params.pluginSetupProcessorAddress,
    signer
  );

  const tx = await pspContract.prepareUpdate(
    params.daoAddressOrEns,
    prepareUpdateParams
  );
  yield {
    key: PrepareUpdateStep.PREPARING,
    txHash: tx.hash,
  };
  const cr = await tx.wait();
  const event = findEventTopicLog(
    cr,
    PluginSetupProcessor__factory.createInterface(),
    'UpdatePrepared'
  );
  const versionTag = event.args['versionTag'];
  const preparedSetupData = event.args['preparedSetupData'];
  const initData = event.args['initData'];
  if (
    !versionTag ||
    versionTag.build !== params.newVersion.build ||
    versionTag.release !== params.newVersion.release ||
    !preparedSetupData ||
    !initData
  ) {
    throw new PluginUpdatePreparationError();
  }
  yield {
    key: PrepareUpdateStep.DONE,
    versionTag,
    pluginRepo: params.pluginRepo,
    pluginAddress: params.pluginAddress,
    initData: hexToBytes(initData),
    permissions: preparedSetupData.permissions,
    helpers: preparedSetupData.helpers,
  };
}

/**
 * Replacing function for ethers getNetwork that includes additional networks
 *
 * @export
 * @param {Networkish} networkish
 * @return {*}  {Network}
 */
export function getNetwork(networkish: Networkish): Network {
  let network: Network | undefined;
  for (const nw of ADDITIONAL_NETWORKS) {
    switch (typeof networkish) {
      case 'string':
        if (networkish === nw.name) {
          network = nw;
        }
        break;
      case 'number':
        if (networkish === nw.chainId) {
          network = nw;
        }
        break;
      case 'object':
        if (networkish.name === nw.name && networkish.chainId === nw.chainId) {
          network = nw;
        }
        break;
      default:
        throw new UnsupportedNetworkError(networkish);
    }
  }
  if (!network) {
    network = ethersGetNetwork(networkish);
  }
  return network;
}
