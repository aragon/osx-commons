import {
  DAOMock,
  DAOMock__factory,
  IDAO,
  IDAO__factory,
  IProposal__factory,
  ProposalMock,
  ProposalMock__factory,
} from '../../../typechain';
import {ExecutedEvent} from '../../../typechain/src/dao/IDAO';
import {erc165ComplianceTests} from '../../helpers';
import {
  IDAO_EVENTS,
  IPROPOSAL_EVENTS,
  findEventTopicLog,
  getInterfaceId,
} from '@aragon/osx-commons-sdk';
import {IProposal__factory as IProposal_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {time} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {BigNumberish, BytesLike} from 'ethers';
import {ethers} from 'hardhat';

describe.skip('IProposal', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(IProposal__factory.createInterface());
    const initial = getInterfaceId(IProposal_V1_0_0__factory.createInterface());
    expect(current).to.equal(initial);
  });
});

export type ProposalData = {
  metadata: BytesLike;
  startDate: BigNumberish;
  endDate: BigNumberish;
  actions: IDAO.ActionStruct[];
  allowFailureMap: BigNumberish;
};

describe.only('Proposal', async () => {
  let alice: SignerWithAddress;
  let bob: SignerWithAddress;
  let exampleData: ProposalData;

  let daoMock: DAOMock;
  let contract: ProposalMock;

  before(async () => {
    [alice, bob] = await ethers.getSigners();
    daoMock = await new DAOMock__factory(alice).deploy();

    const uri = ethers.utils.hexlify(
      ethers.utils.toUtf8Bytes(
        'ipfs://QmTMcfhxgYA3ziwpnhEg1K3aFn7ixMH9dBxWXs5YTJdZwR'
      )
    );
    const current = await time.latest();

    exampleData = {
      metadata: uri,
      startDate: current,
      endDate: current + 12,
      actions: [],
      allowFailureMap: 0,
    };
  });

  beforeEach(async () => {
    contract = await new ProposalMock__factory(alice).deploy();
  });

  it('counts proposals', async () => {
    expect(await contract.proposalCount()).to.equal(0);

    const creator = bob;

    await contract
      .connect(alice)
      .createProposal(
        creator.address,
        exampleData.metadata,
        exampleData.startDate,
        exampleData.endDate,
        exampleData.actions,
        exampleData.allowFailureMap
      );

    expect(await contract.proposalCount()).to.equal(1);
  });

  it('creates proposalIds', async () => {
    const expectedProposalId = 0;
    const proposalId = await contract.callStatic.createProposalId();

    expect(proposalId).to.equal(expectedProposalId);
  });

  it('creates proposals', async () => {
    const expectedProposalId = 0;
    const creator = bob;

    const proposalId = await contract
      .connect(alice)
      .callStatic.createProposal(
        creator.address,
        exampleData.metadata,
        exampleData.startDate,
        exampleData.endDate,
        exampleData.actions,
        exampleData.allowFailureMap
      );

    expect(proposalId).to.equal(expectedProposalId);
  });

  it('emits the `ProposalCreated` event', async () => {
    const expectedProposalId = 0;
    const creator = bob;

    await expect(
      contract
        .connect(alice)
        .createProposal(
          creator.address,
          exampleData.metadata,
          exampleData.startDate,
          exampleData.endDate,
          exampleData.actions,
          exampleData.allowFailureMap
        )
    )
      .to.emit(contract, IPROPOSAL_EVENTS.PROPOSAL_CREATED)
      .withArgs(
        expectedProposalId,
        creator.address,
        exampleData.startDate,
        exampleData.endDate,
        exampleData.metadata,
        exampleData.actions,
        exampleData.allowFailureMap
      );
  });

  it('executes proposals', async () => {
    const expectedExecResults: string[] = [];
    const expectedFailureMap: BigNumberish = 0;

    const proposalId = 0;
    const [execResults, failureMap] = await contract
      .connect(alice)
      .callStatic.executeProposal(
        daoMock.address,
        proposalId,
        exampleData.actions,
        exampleData.allowFailureMap
      );

    expect(execResults).to.deep.equal(expectedExecResults);
    expect(failureMap).to.equal(expectedFailureMap);
  });

  it('emits the `ProposalExecuted` event', async () => {
    const proposalId = 0;

    await expect(
      contract
        .connect(alice)
        .executeProposal(
          daoMock.address,
          proposalId,
          exampleData.actions,
          exampleData.allowFailureMap
        )
    )
      .to.emit(contract, IPROPOSAL_EVENTS.PROPOSAL_EXECUTED)
      .withArgs(proposalId);
  });

  it('emits the `Executed` event on the executing DAO', async () => {
    const proposalId = 0;
    const proposalIdAsBytes32 = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(proposalId),
      32
    );

    const expectedActor = contract.address;
    const expectedExecResults: string[] = [];
    const expectedFailureMap: BigNumberish = 0;

    const tx = await contract
      .connect(alice)
      .executeProposal(
        daoMock.address,
        proposalId,
        exampleData.actions,
        exampleData.allowFailureMap
      );
    const event = await findEventTopicLog<ExecutedEvent>(
      tx,
      IDAO__factory.createInterface(),
      IDAO_EVENTS.EXECUTED
    );

    expect(event.args.actor).to.equal(expectedActor);
    expect(event.args.callId).to.equal(proposalIdAsBytes32);
    expect(event.args.actions).to.deep.equal(exampleData.actions);
    expect(event.args.allowFailureMap).to.equal(exampleData.allowFailureMap);
    expect(event.args.failureMap).to.equal(expectedFailureMap);
    expect(event.args.execResults).to.deep.equal(expectedExecResults);
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(contract, alice);
    });

    it('supports the `IProposal` interface', async () => {
      const iface = IProposal__factory.createInterface();
      expect(await contract.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });
});

describe.skip('ProposalUpgradeable', async () => {
  // TODO run the same tests as for `DaoAuthorizable`.

  it('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});
