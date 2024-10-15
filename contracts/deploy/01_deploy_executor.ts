import executor from '../artifacts/src/executors/Executor.sol/Executor.json';
import {verifyContract} from '../utils/etherscan';
import {DeployFunction} from 'hardhat-deploy/types';
import {HardhatRuntimeEnvironment} from 'hardhat/types';

/**
 * Creates a plugin repo under Aragon's ENS base domain with subdomain requested in the `./plugin-settings.ts` file.
 * @param {HardhatRuntimeEnvironment} hre
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, ethers} = hre;
  const {deploy} = deployments;
  const [deployer] = await ethers.getSigners();

  console.log(`Deploying Executor...`);

  // deploy
  await deploy('Executor', {
    contract: executor,
    from: deployer.address,
    args: [],
    log: true,
  });

  // verify

  const element = await deployments.get('Executor');

  console.log(
    `Verifying address ${element.address} with constructor argument ${element.args}.`
  );
  await verifyContract(element.address, element.args || []);
};

export default func;
func.tags = ['New', 'Executor'];
