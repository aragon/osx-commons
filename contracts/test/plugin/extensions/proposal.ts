import {
  DAOMock,
  DAOMock__factory,
  IDAO,
  IDAO__factory,
  IProposal__factory,
  ProposalMock,
  ProposalUpgradeableMock,
  ProposalMock__factory,
  ProposalUpgradeableMock__factory,
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
import {loadFixture, time} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {BigNumberish, BytesLike} from 'ethers';
import {ethers} from 'hardhat';

export type ProposalData = {
  metadata: BytesLike;
  startDate: BigNumberish;
  endDate: BigNumberish;
  actions: IDAO.ActionStruct[];
  allowFailureMap: BigNumberish;
};

describe('IProposal', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(IProposal__factory.createInterface());
    const initial = getInterfaceId(IProposal_V1_0_0__factory.createInterface());
    expect(current).to.equal(initial);
  });
});

describe('Proposal', async () => {
  proposalBaseTests(proposalFixture);
});

describe('ProposalUpgradeable', async () => {
  proposalBaseTests(proposalUpgradeableFixture);

  it.skip('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it.skip('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});

// Contains tests for functionality common for `ProposalMock` and `ProposalUpgradeableMock` to avoid duplication.
function proposalBaseTests(fixture: () => Promise<ProposalFixtureInput>) {
  it('counts proposals', async () => {
    const {alice, bob, proposalMock, exampleData} = await loadFixture(fixture);

    expect(await proposalMock.proposalCount()).to.equal(0);

    const creator = bob;

    await proposalMock
      .connect(alice)
      .createProposal(
        creator.address,
        exampleData.metadata,
        exampleData.startDate,
        exampleData.endDate,
        exampleData.actions,
        exampleData.allowFailureMap
      );

    expect(await proposalMock.proposalCount()).to.equal(1);
  });

  it('creates proposalIds', async () => {
    const {proposalMock} = await loadFixture(fixture);
    const expectedProposalId = 0;
    const proposalId = await proposalMock.callStatic.createProposalId();

    expect(proposalId).to.equal(expectedProposalId);
  });

  it('creates proposals', async () => {
    const {alice, bob, proposalMock, exampleData} = await loadFixture(fixture);

    const expectedProposalId = 0;
    const creator = bob;

    const proposalId = await proposalMock
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
    const {alice, bob, proposalMock, exampleData} = await loadFixture(fixture);

    const expectedProposalId = 0;
    const creator = bob;

    await expect(
      proposalMock
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
      .to.emit(proposalMock, IPROPOSAL_EVENTS.PROPOSAL_CREATED)
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
    const {alice, daoMock, proposalMock, exampleData} = await loadFixture(
      fixture
    );

    const expectedExecResults: string[] = [];
    const expectedFailureMap: BigNumberish = 0;

    const proposalId = 0;
    const [execResults, failureMap] = await proposalMock
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
    const {alice, daoMock, proposalMock, exampleData} = await loadFixture(
      fixture
    );

    const proposalId = 0;

    await expect(
      proposalMock
        .connect(alice)
        .executeProposal(
          daoMock.address,
          proposalId,
          exampleData.actions,
          exampleData.allowFailureMap
        )
    )
      .to.emit(proposalMock, IPROPOSAL_EVENTS.PROPOSAL_EXECUTED)
      .withArgs(proposalId);
  });

  it('emits the `Executed` event on the executing DAO', async () => {
    const {alice, daoMock, proposalMock, exampleData} = await loadFixture(
      fixture
    );

    const proposalId = 0;
    const proposalIdAsBytes32 = ethers.utils.hexZeroPad(
      ethers.utils.hexlify(proposalId),
      32
    );

    const expectedActor = proposalMock.address;
    const expectedExecResults: string[] = [];
    const expectedFailureMap: BigNumberish = 0;

    const tx = await proposalMock
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
      const {alice, proposalMock} = await loadFixture(fixture);
      await erc165ComplianceTests(proposalMock, alice);
    });

    it('supports the `IProposal` interface', async () => {
      const {proposalMock} = await loadFixture(fixture);
      const iface = IProposal__factory.createInterface();
      expect(await proposalMock.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });
}

type BaseFixtureInput = {
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  daoMock: DAOMock;
  exampleData: ProposalData;
};

async function baseFixture(): Promise<BaseFixtureInput> {
  const [alice, bob] = await ethers.getSigners();
  const daoMock = await new DAOMock__factory(alice).deploy();

  const uri = ethers.utils.hexlify(
    ethers.utils.toUtf8Bytes(
      'ipfs://QmTMcfhxgYA3ziwpnhEg1K3aFn7ixMH9dBxWXs5YTJdZwR'
    )
  );
  const current = await time.latest();

  const exampleData = {
    metadata: uri,
    startDate: current,
    endDate: current + 12,
    actions: [],
    allowFailureMap: 0,
  };

  return {alice, bob, daoMock, exampleData};
}

type ProposalFixtureInput = {
  proposalMock: ProposalMock | ProposalUpgradeableMock;
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  daoMock: DAOMock;
  exampleData: ProposalData;
};

async function proposalFixture(): Promise<ProposalFixtureInput> {
  const {alice, bob, daoMock, exampleData} = await baseFixture();

  const proposalMock = await new ProposalMock__factory(alice).deploy();

  return {alice, bob, proposalMock, daoMock, exampleData};
}

async function proposalUpgradeableFixture(): Promise<ProposalFixtureInput> {
  const {alice, bob, daoMock, exampleData} = await baseFixture();

  const proposalMock = await new ProposalUpgradeableMock__factory(
    alice
  ).deploy();

  return {alice, bob, proposalMock, daoMock, exampleData};
}
