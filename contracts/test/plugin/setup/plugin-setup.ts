import {
  IPluginSetup__factory,
  IProtocolVersion__factory,
  PluginSetupMockBuild1,
  PluginSetupMockBuild1__factory,
} from '../../../typechain';
import {erc165ComplianceTests} from '../../helpers';
import {osxCommonsContractsVersion} from '../../utils/versioning/protocol-version';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IPluginSetup__factory as IPluginSetup_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('IPluginSetup', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(IPluginSetup__factory.createInterface());
    const initial = getInterfaceId(
      IPluginSetup_V1_0_0__factory.createInterface()
    );
    expect(current).to.equal(initial);
  });
});

describe('PluginSetup', async () => {
  let deployer: SignerWithAddress;
  let pluginSetup: PluginSetupMockBuild1;

  before(async () => {
    [deployer] = await ethers.getSigners();
    pluginSetup = await new PluginSetupMockBuild1__factory(deployer).deploy();
  });

  describe('ProtocolVersion', async () => {
    it('returns the current protocol version matching the semantic version of the `osx-contracts-commons` package', async () => {
      expect(await pluginSetup.protocolVersion()).to.deep.equal(
        osxCommonsContractsVersion()
      );
    });
  });

  it.skip('creates ERC1967 proxies', async () => {
    // TODO this will likely be refactored with task OS-675
    expect(true).to.equal(false);
  });

  // TODO think about more tests

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(pluginSetup, deployer);
    });

    it('supports the `IPluginSetup` interface', async () => {
      const iface = IPluginSetup__factory.createInterface();
      expect(await pluginSetup.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const iface = IProtocolVersion__factory.createInterface();
      expect(await pluginSetup.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });

  it.skip('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it.skip('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});
