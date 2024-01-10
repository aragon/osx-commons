import {IProposal__factory} from '../../../typechain';
import {erc165ComplianceTests} from '../../helpers';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IProposal__factory as IProposal_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {Contract} from 'ethers';
import {ethers} from 'hardhat';

describe('IProposal', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(IProposal__factory.createInterface());
    const initial = getInterfaceId(IProposal_V1_0_0__factory.createInterface());
    expect(current).to.equal(initial);
  });
});

describe.skip('Proposal', async () => {
  let deployer: SignerWithAddress;
  let contract: Contract; // TODO create ProposalMock

  before(async () => {
    [deployer] = await ethers.getSigners();
    //contract = await new ProposalMock__factory(deployer).deploy();
  });

  // TODO abstract these common tests that also apply to `DaoAuthorizableUpgradeable`
  it('counts proposals', async () => {
    expect(true).to.equal(false);
  });

  it('creates proposalIds', async () => {
    expect(true).to.equal(false);
  });

  it('creates proposals', async () => {
    expect(true).to.equal(false);
  });

  it('emits the `ProposalCreated` event', async () => {
    expect(true).to.equal(false);
  });

  it('executes proposals', async () => {
    expect(true).to.equal(false);
  });

  it('emits the `ProposalExecuted` event', async () => {
    expect(true).to.equal(false);
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(contract, deployer);
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
