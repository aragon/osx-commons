import {
  IERC165__factory,
  IPluginSetup__factory,
  IProtocolVersion__factory,
} from '../../../typechain';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {expect} from 'chai';
import {Contract} from 'ethers';

// TODO

describe.skip('IPluginSetup', async () => {
  it('has the same interface ID as in OSx v1.0.0', async () => {
    expect(true).to.equal(false);
  });
});

describe.skip('PluginSetup', async () => {
  let contract: Contract; // TODO create ProposalMock

  it('creates ERC1967 proxies', async () => {
    // TODO this will likely be refactored with task OS-675
    expect(true).to.equal(false);
  });

  // TODO think about more tests

  describe('ERC-165', async () => {
    it('does not support the empty interface', async () => {
      expect(await contract.supportsInterface('0xffffffff')).to.be.false;
    });

    it('supports the `IERC165` interface', async () => {
      const iface = IERC165__factory.createInterface();
      expect(await contract.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });

    it('supports the `IPluginSetup` interface', async () => {
      const iface = IPluginSetup__factory.createInterface();
      expect(await contract.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const iface = IProtocolVersion__factory.createInterface();
      expect(await contract.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });

  it('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});
