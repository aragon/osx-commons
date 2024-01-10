import {IERC165__factory, IProposal__factory} from '../../../typechain';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {expect} from 'chai';
import {Contract} from 'ethers';

// TODO

describe.skip('IProposal', async () => {
  it('has the same interface ID as in OSx v1.0.0', async () => {
    expect(true).to.equal(false);
  });
});

describe.skip('Proposal', async () => {
  let contract: Contract; // TODO create ProposalMock

  before(async () => {
    //const [deployer] = await ethers.getSigners();
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
    it('does not support the empty interface', async () => {
      expect(await contract.supportsInterface('0xffffffff')).to.be.false;
    });

    it('supports the `IERC165` interface', async () => {
      const iface = IERC165__factory.createInterface();
      expect(await contract.supportsInterface(getInterfaceId(iface))).to.be
        .true;
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
