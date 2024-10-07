import {
  DAOMock,
  DAOMock__factory,
  IProposal__factory,
  ProposalMock,
  ProposalUpgradeableMock,
  ProposalMock__factory,
  ProposalUpgradeableMock__factory,
  MetadataContractMock__factory,
  MetadataContractUpgradeableMock__factory,
  MetadataContractMock,
  MetadataContractUpgradeableMock,
} from '../../../typechain';
import {MetadataContractUpgradeableInterface} from '../../../typechain/src/plugin/extensions/metadata/MetadataContractUpgradeable';
import {erc165ComplianceTests} from '../../helpers';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IProposal__factory as IProposal_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe.only('MetadataContract', async () => {
  proposalBaseTests(metadataFixture);
});

describe('MetadataContractUpgradeable', async () => {
  proposalBaseTests(metadataUpgradeableFixture);
});

// Contains tests for functionality common for `metadataMock` and `ProposalUpgradeableMock` to avoid duplication.
function proposalBaseTests(fixture: () => Promise<FixtureResult>) {
  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {metadataMock} = await loadFixture(fixture);
      const signers = await ethers.getSigners();
      await erc165ComplianceTests(metadataMock, signers[0]);
    });

    it('supports the `updateMetadata/getMetadata` selector interface', async () => {
      const {metadataMock} = await loadFixture(fixture);
      const iface = MetadataContractMock__factory.createInterface();
      const interfaceId = ethers.BigNumber.from(
        iface.getSighash('updateMetadata')
      )
        .xor(ethers.BigNumber.from(iface.getSighash('getMetadata')))
        .toHexString();

      expect(await metadataMock.supportsInterface(interfaceId)).to.be.true;
    });
  });

  describe('updateMetadata/getMetadata', async () => {
    let data: FixtureResult;
    beforeEach(async () => {
      data = await loadFixture(fixture);
      const {metadataMock, daoMock} = data;
      await daoMock.setHasPermissionReturnValueMock(true);
    });

    it("reverts if caller doesn't have a permission", async () => {
      const {metadataMock, daoMock} = data;
      await daoMock.setHasPermissionReturnValueMock(false);

      await expect(
        metadataMock.updateMetadata('0x11')
      ).to.be.revertedWithCustomError(metadataMock, 'DaoUnauthorized');
    });

    it('reverts if empty metadata is being set', async () => {
      const {metadataMock} = data;

      await expect(
        metadataMock.updateMetadata('0x')
      ).to.be.revertedWithCustomError(metadataMock, 'EmptyMetadata');
    });

    it('sets the metadata and emits the event', async () => {
      const {metadataMock} = data;
      const metadata = '0x11';
      await expect(metadataMock.updateMetadata(metadata))
        .to.emit(metadataMock, 'MetadataUpdated')
        .withArgs(metadata);
    });

    it('retrieves the metadata', async () => {
      const {metadataMock} = data;
      let metadata = '0x11';
      await metadataMock.updateMetadata(metadata);
      expect(await metadataMock.getMetadata()).to.equal(metadata);

      // Check that it correctly retrieves the metadata if the length is > 32
      // This ensures that our `sstore/sload` operations behave correctly.
      metadata = '0x' + '11'.repeat(50);
      await metadataMock.updateMetadata(metadata);
      expect(await metadataMock.getMetadata()).to.equal(metadata);
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
  metadataMock: MetadataContractMock | MetadataContractUpgradeableMock;
  daoMock: DAOMock;
};

async function metadataFixture(): Promise<FixtureResult> {
  const {daoMock} = await baseFixture();
  const signers = await ethers.getSigners();
  const metadataMock = await new MetadataContractMock__factory(
    signers[0]
  ).deploy(daoMock.address);

  return {metadataMock, daoMock};
}

async function metadataUpgradeableFixture(): Promise<FixtureResult> {
  const {daoMock} = await baseFixture();
  const signers = await ethers.getSigners();

  const metadataMock = await new MetadataContractUpgradeableMock__factory(
    signers[0]
  ).deploy();

  await metadataMock.initialize(daoMock.address);

  return {metadataMock, daoMock};
}
