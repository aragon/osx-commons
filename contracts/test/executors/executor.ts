import {
  ActionExecute__factory,
  Executor,
  Executor__factory,
  GasConsumer__factory,
  IExecutor__factory,
} from '../../typechain';
import {ExecutedEvent} from '../../typechain/src/executors/Executor';
import {erc165ComplianceTests} from '../helpers';
import {findEvent, flipBit, getInterfaceId} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

export const ZERO_BYTES32 =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

const MAX_ACTIONS = 256;
const errorSignature = '0x08c379a0'; // first 4 bytes of Error(string)

const EventExecuted = 'Executed';

export async function getActions() {
  const signers = await ethers.getSigners();
  const ActionExecuteFactory = new ActionExecute__factory(signers[0]);
  const ActionExecute = await ActionExecuteFactory.deploy();
  const iface = new ethers.utils.Interface(ActionExecute__factory.abi);

  const num = 20;
  return {
    failAction: {
      to: ActionExecute.address,
      data: iface.encodeFunctionData('fail'),
      value: 0,
    },
    succeedAction: {
      to: ActionExecute.address,
      data: iface.encodeFunctionData('setTest', [num]),
      value: 0,
    },
    reentrancyAction: {
      to: ActionExecute.address,
      data: iface.encodeFunctionData('callBackCaller'),
      value: 0,
    },
    failActionMessage: ethers.utils
      .hexlify(ethers.utils.toUtf8Bytes('ActionExecute:Revert'))
      .substring(2),
    successActionResult: ethers.utils.hexZeroPad(ethers.utils.hexlify(num), 32),
  };
}

describe('Executor', async () => {
  let data: any;
  let executor: Executor;
  let ownerAddress: string;
  let signers: SignerWithAddress[];

  before(async () => {
    data = await getActions();
    signers = await ethers.getSigners();
    ownerAddress = await signers[0].getAddress();

    executor = await new Executor__factory(signers[0]).deploy();
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(executor, signers[0]);
    });

    it('supports the `IExecutor` interface', async () => {
      expect(
        await executor.supportsInterface(
          getInterfaceId(IExecutor__factory.createInterface())
        )
      ).to.be.true;
    });
  });

  it('reverts if array of actions is too big', async () => {
    const actions = [];
    for (let i = 0; i < MAX_ACTIONS; i++) {
      actions[i] = data.succeedAction;
    }

    await expect(executor.execute(ZERO_BYTES32, actions, 0)).not.to.be.reverted;

    // add one more to make sure it fails
    actions[MAX_ACTIONS] = data.failAction;

    await expect(
      executor.execute(ZERO_BYTES32, actions, 0)
    ).to.be.revertedWithCustomError(executor, 'TooManyActions');
  });

  it("reverts if action is failable and allowFailureMap doesn't include it", async () => {
    await expect(executor.execute(ZERO_BYTES32, [data.failAction], 0))
      .to.be.revertedWithCustomError(executor, 'ActionFailed')
      .withArgs(0);
  });

  it('reverts if one of the action called back the Executor with reentrancy', async () => {
    // Allow the call to fail so we can get the error message
    // in the `execResults`, otherwise with allowFailureMap = 0,
    // it fails with `ActionFailed` even though reentrancy worked correctly.
    const allowFailureMap = flipBit(0, ethers.BigNumber.from(0));

    const tx = await executor.execute(
      ZERO_BYTES32,
      [data.reentrancyAction],
      allowFailureMap
    );
    const event = findEvent<ExecutedEvent>(await tx.wait(), EventExecuted);
    const execResult = event.args.execResults[0];

    const reentrancyErrorSignature =
      Executor__factory.createInterface().encodeErrorResult('ReentrantCall');

    expect(reentrancyErrorSignature).to.equal(execResult);

    // If called with allowFailureMap = 0, it must fail with `ActionFailed`.
    await expect(
      executor.execute(ZERO_BYTES32, [data.reentrancyAction], 0)
    ).to.be.revertedWithCustomError(executor, 'ActionFailed');
  });

  it('succeeds if action is failable but allowFailureMap allows it', async () => {
    let num = ethers.BigNumber.from(0);
    num = flipBit(0, num);

    const tx = await executor.execute(ZERO_BYTES32, [data.failAction], num);
    const event = findEvent<ExecutedEvent>(await tx.wait(), EventExecuted);

    // Check that failAction's revertMessage was correctly stored in the executor's execResults
    expect(event.args.execResults[0]).to.includes(data.failActionMessage);
    expect(event.args.execResults[0]).to.includes(errorSignature);
  });

  it('returns the correct result if action succeeds', async () => {
    const tx = await executor.execute(ZERO_BYTES32, [data.succeedAction], 0);
    const event = findEvent<ExecutedEvent>(await tx.wait(), EventExecuted);
    expect(event.args.execResults[0]).to.equal(data.successActionResult);
  });

  it('succeeds and correctly constructs failureMap results ', async () => {
    let allowFailureMap = ethers.BigNumber.from(0);
    const actions = [];

    // First 3 actions will fail
    actions[0] = data.failAction;
    actions[1] = data.failAction;
    actions[2] = data.failAction;

    // The next 3 actions will succeed
    actions[3] = data.succeedAction;
    actions[4] = data.succeedAction;
    actions[5] = data.succeedAction;

    // add first 3 actions in the allowFailureMap
    // to make sure tx succeeds.
    for (let i = 0; i < 3; i++) {
      allowFailureMap = flipBit(i, allowFailureMap);
    }

    // If the below call not fails, means allowFailureMap is correct.
    const tx = await executor.execute(ZERO_BYTES32, actions, allowFailureMap);
    const event = findEvent<ExecutedEvent>(await tx.wait(), EventExecuted);

    expect(event.args.actor).to.equal(ownerAddress);
    expect(event.args.callId).to.equal(ZERO_BYTES32);
    expect(event.args.allowFailureMap).to.equal(allowFailureMap);

    // construct the failureMap which only has those
    // bits set at indexes where actions failed
    let failureMap = ethers.BigNumber.from(0);
    for (let i = 0; i < 3; i++) {
      failureMap = flipBit(i, failureMap);
    }
    // Check that executor correctly generated failureMap
    expect(event.args.failureMap).to.equal(failureMap);

    // Check that execResult emitted correctly stores action results.
    for (let i = 0; i < 3; i++) {
      expect(event.args.execResults[i]).to.includes(data.failActionMessage);
      expect(event.args.execResults[i]).to.includes(errorSignature);
    }
    for (let i = 3; i < 6; i++) {
      expect(event.args.execResults[i]).to.equal(data.successActionResult);
    }

    // lets remove one of the action from allowFailureMap
    // to see tx will actually revert.
    allowFailureMap = flipBit(2, allowFailureMap);
    await expect(executor.execute(ZERO_BYTES32, actions, allowFailureMap))
      .to.be.revertedWithCustomError(executor, 'ActionFailed')
      .withArgs(2); // Since we unset the 2th action from failureMap, it should fail with that index.
  });

  it('emits an event afterwards', async () => {
    const tx = await executor.execute(ZERO_BYTES32, [data.succeedAction], 0);
    const rc = await tx.wait();

    const event = findEvent<ExecutedEvent>(rc, 'Executed');
    expect(event.args.actor).to.equal(ownerAddress);
    expect(event.args.callId).to.equal(ZERO_BYTES32);
    expect(event.args.actions.length).to.equal(1);
    expect(event.args.actions[0].to).to.equal(data.succeedAction.to);
    expect(event.args.actions[0].value).to.equal(data.succeedAction.value);
    expect(event.args.actions[0].data).to.equal(data.succeedAction.data);
    expect(event.args.execResults[0]).to.equal(data.successActionResult);
    expect(event.args.allowFailureMap).to.equal(0);
  });

  it('reverts if failure is allowed but not enough gas is provided (many actions)', async () => {
    const GasConsumer = new GasConsumer__factory(signers[0]);
    const gasConsumer = await GasConsumer.deploy();

    // Prepare an action array calling `consumeGas` twenty times.
    const gasConsumingAction = {
      to: gasConsumer.address,
      data: GasConsumer.interface.encodeFunctionData('consumeGas', [20]),
      value: 0,
    };

    let allowFailureMap = ethers.BigNumber.from(0);
    allowFailureMap = flipBit(0, allowFailureMap); // allow the action to fail

    const expectedGas = await executor.estimateGas.execute(
      ZERO_BYTES32,
      [gasConsumingAction],
      allowFailureMap
    );

    // Provide too little gas so that the last `to.call` fails, but the remaining gas is enough to finish the subsequent operations.
    await expect(
      executor.execute(ZERO_BYTES32, [gasConsumingAction], allowFailureMap, {
        gasLimit: expectedGas.sub(32000),
      })
    ).to.be.revertedWithCustomError(executor, 'InsufficientGas');

    // Provide enough gas so that the entire call passes.
    await expect(
      executor.execute(ZERO_BYTES32, [gasConsumingAction], allowFailureMap, {
        gasLimit: expectedGas,
      })
    ).to.not.be.reverted;
  });

  it('reverts if failure is allowed but not enough gas is provided (one action)', async () => {
    const GasConsumer = new GasConsumer__factory(signers[0]);
    const gasConsumer = await GasConsumer.deploy();

    // Prepare an action array calling `consumeGas` one times.
    const gasConsumingAction = {
      to: gasConsumer.address,
      data: GasConsumer.interface.encodeFunctionData('consumeGas', [3]),
      value: 0,
    };

    let allowFailureMap = ethers.BigNumber.from(0);
    allowFailureMap = flipBit(0, allowFailureMap); // allow the action to fail

    const expectedGas = await executor.estimateGas.execute(
      ZERO_BYTES32,
      [gasConsumingAction],
      allowFailureMap
    );

    // Provide too little gas so that the last `to.call` fails, but the remaining gas is enough to finish the subsequent operations.
    await expect(
      executor.execute(ZERO_BYTES32, [gasConsumingAction], allowFailureMap, {
        gasLimit: expectedGas.sub(10200),
      })
    ).to.be.revertedWithCustomError(executor, 'InsufficientGas');

    // Provide enough gas so that the entire call passes.
    await expect(
      executor.execute(ZERO_BYTES32, [gasConsumingAction], allowFailureMap, {
        gasLimit: expectedGas,
      })
    ).to.not.be.reverted;
  });
});
