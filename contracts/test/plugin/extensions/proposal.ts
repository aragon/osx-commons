import {
  DAOMock,
  DAOMock__factory,
  IProposal__factory,
  ProposalMock,
  ProposalUpgradeableMock,
  ProposalMock__factory,
  ProposalUpgradeableMock__factory,
} from '../../../typechain';
import {erc165ComplianceTests} from '../../helpers';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IProposal__factory as IProposal_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('Proposal', async () => {
  proposalBaseTests(proposalFixture);
});

describe('ProposalUpgradeable', async () => {
  proposalBaseTests(proposalUpgradeableFixture);
});

// Contains tests for functionality common for `ProposalMock` and `ProposalUpgradeableMock` to avoid duplication.
function proposalBaseTests(fixture: () => Promise<FixtureResult>) {
  it('returns max value of integer for backwards-compatibility', async () => {
    const {proposalMock} = await loadFixture(fixture);

    await expect(proposalMock.proposalCount()).to.be.reverted;
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {proposalMock} = await loadFixture(fixture);
      const signers = await ethers.getSigners();
      await erc165ComplianceTests(proposalMock, signers[0]);
    });

    it('supports the `IProposal` interface for the new as well as old versions', async () => {
      const {proposalMock} = await loadFixture(fixture);
      const newIface = IProposal__factory.createInterface();
      expect(await proposalMock.supportsInterface(getInterfaceId(newIface))).to
        .be.true;

      const oldIface = IProposal_V1_0_0__factory.createInterface();
      expect(await proposalMock.supportsInterface(getInterfaceId(oldIface))).to
        .be.true;
    });
  });
}

type BaseFixtureResult = {
  daoMock: DAOMock;
};

async function baseFixture(): Promise<BaseFixtureResult> {
  const signers = await ethers.getSigners();
  const daoMock = await new DAOMock__factory(signers[0]).deploy();

  return {daoMock};
}

type FixtureResult = {
  proposalMock: ProposalMock | ProposalUpgradeableMock;
  daoMock: DAOMock;
};

async function proposalFixture(): Promise<FixtureResult> {
  const {daoMock} = await baseFixture();
  const signers = await ethers.getSigners();
  const proposalMock = await new ProposalMock__factory(signers[0]).deploy();

  return {proposalMock, daoMock};
}

async function proposalUpgradeableFixture(): Promise<FixtureResult> {
  const {daoMock} = await baseFixture();
  const signers = await ethers.getSigners();

  const proposalMock = await new ProposalUpgradeableMock__factory(
    signers[0]
  ).deploy();

  return {proposalMock, daoMock};
}
