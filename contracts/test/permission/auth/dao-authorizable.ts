import {
  DAOMock,
  DAOMock__factory,
  DaoAuthorizableMock,
  DaoAuthorizableMock__factory,
  DaoAuthorizableUpgradeableMock,
  DaoAuthorizableUpgradeableMock__factory,
} from '../../../typechain';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('DaoAuthorizable', async () => {
  daoAuthorizableBaseTests(daoAuthorizableFixture);
});

describe('DaoAuthorizableUpgradeable', async () => {
  daoAuthorizableBaseTests(daoAuthorizableUpgradeableFixture);

  describe('initialize', async () => {
    it('reverts if `initialize` is called again', async () => {
      const {alice, daoAuthorizableMock, daoMock} = await loadFixture(
        daoAuthorizableUpgradeableFixture
      );
      const daoAuthorizableUpgradeableMock =
        new DaoAuthorizableUpgradeableMock__factory(alice).attach(
          daoAuthorizableMock.address
        );

      await expect(
        daoAuthorizableUpgradeableMock.initialize(daoMock.address)
      ).to.be.revertedWith('Initializable: contract is already initialized');
    });
  });
  describe('__DaoAuthorizableUpgradeable_init', async () => {
    it('reverts if an function tries to call `__DaoAuthorizableUpgradeable_init` without being an initializer', async () => {
      const {alice, daoAuthorizableMock, daoMock} = await loadFixture(
        daoAuthorizableUpgradeableFixture
      );
      const daoAuthorizableUpgradeableMock =
        new DaoAuthorizableUpgradeableMock__factory(alice).attach(
          daoAuthorizableMock.address
        );

      await expect(
        daoAuthorizableUpgradeableMock.notAnInitializer(daoMock.address)
      ).to.be.revertedWith('Initializable: contract is not initializing');
    });
  });
});

// Contains tests for functionality common for `DaoAuthorizableMock` and `DaoAuthorizableUpgradeableMock` to avoid duplication.
function daoAuthorizableBaseTests(fixture: () => Promise<FixtureResult>) {
  const permissionId = ethers.utils.id('AUTHORIZED_FUNC_PERMISSION');

  it('initializes the contract with a DAO address', async () => {
    const {daoAuthorizableMock, daoMock} = await loadFixture(fixture);
    expect(await daoAuthorizableMock.dao()).to.equal(daoMock.address);
  });

  it('reverts calls to `auth`-protected functions if the permission is not granted', async () => {
    const {bob, daoAuthorizableMock, daoMock} = await loadFixture(fixture);

    // Check that the mock DAO will answer that the permission is not granted.
    expect(await daoMock.hasPermissionReturnValueMock()).to.be.false;

    // Check that the call reverts
    await expect(daoAuthorizableMock.connect(bob).authorizedFunc())
      .to.be.revertedWithCustomError(daoAuthorizableMock, 'DaoUnauthorized')
      .withArgs(
        daoMock.address,
        daoAuthorizableMock.address,
        bob.address,
        permissionId
      );
  });

  it('accepts calls to `auth`-protected functions if the permission is granted', async () => {
    const {bob, daoAuthorizableMock, daoMock} = await loadFixture(fixture);

    // Check that the mock DAO will answer that the permission is granted.
    await daoMock.setHasPermissionReturnValueMock(true);
    expect(await daoMock.hasPermissionReturnValueMock()).to.be.true;

    // Check that the call passes
    await expect(daoAuthorizableMock.connect(bob).authorizedFunc()).to.not.be
      .reverted;
  });
}

type FixtureResult = {
  alice: SignerWithAddress;
  bob: SignerWithAddress;
  daoAuthorizableMock: DaoAuthorizableMock | DaoAuthorizableUpgradeableMock;
  daoMock: DAOMock;
};

async function daoAuthorizableFixture(): Promise<FixtureResult> {
  const [alice, bob] = await ethers.getSigners();
  const daoMock = await new DAOMock__factory(alice).deploy();
  const daoAuthorizableMock = await new DaoAuthorizableMock__factory(
    alice
  ).deploy(daoMock.address);

  return {alice, bob, daoAuthorizableMock, daoMock};
}

async function daoAuthorizableUpgradeableFixture(): Promise<FixtureResult> {
  const [alice, bob] = await ethers.getSigners();
  const daoMock = await new DAOMock__factory(alice).deploy();
  const daoAuthorizableMock = await new DaoAuthorizableUpgradeableMock__factory(
    alice
  ).deploy();

  await daoAuthorizableMock.initialize(daoMock.address);

  return {alice, bob, daoAuthorizableMock, daoMock};
}
