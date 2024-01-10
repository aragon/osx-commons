import {
  IERC165__factory,
  IPermissionCondition__factory,
  IProtocolVersion__factory,
  PermissionConditionMock,
  PermissionConditionMock__factory,
} from '../../typechain';
import {erc165ComplianceTests} from '../helpers';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

// TODO

describe('PermissionCondition', async () => {
  let condition: PermissionConditionMock;
  let deployer: SignerWithAddress;

  before(async () => {
    [deployer] = await ethers.getSigners();
    condition = await new PermissionConditionMock__factory(deployer).deploy();
  });

  // TODO abstract these common tests that also apply to `PermissionConditionUpgradeable`
  it.skip('throws an error if the permission is not granted', async () => {
    expect(true).to.equal(false);
  });

  it.skip('relays the authorization to `PermissionCondition` if the permission was granted with `grantWithCondition`', async () => {
    expect(true).to.equal(false);
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      await erc165ComplianceTests(condition, deployer);
    });

    it('supports the `IPermissionCondition` interface', async () => {
      const iface = IPermissionCondition__factory.createInterface();
      expect(await condition.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });

    it('supports the `IProtocolVersion` interface', async () => {
      const iface = IProtocolVersion__factory.createInterface();
      expect(await condition.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });
});

describe.skip('PermissionConditionUpgradeable', async () => {
  // TODO run the same tests as for `PermissionCondition`.

  it('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});
