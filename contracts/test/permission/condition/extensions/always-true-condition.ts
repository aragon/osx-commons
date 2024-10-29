import {
  AlwaysTrueCondition,
  AlwaysTrueCondition__factory,
} from '../../../../typechain';
import {DUMMY_PERMISSION_ID} from '../../../utils/condition/condition';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {Wallet} from 'ethers';
import {ethers} from 'hardhat';

describe('AlwaysTrueCondition', async () => {
  it('it should always say is granted true', async () => {
    const {alwaysTrueCondition} = await loadFixture(fixture);
    expect(
      await alwaysTrueCondition.isGranted(
        Wallet.createRandom().address,
        Wallet.createRandom().address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;
  });
});

type FixtureResult = {
  deployer: SignerWithAddress;
  alwaysTrueCondition: AlwaysTrueCondition;
};

async function fixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const alwaysTrueCondition = await new AlwaysTrueCondition__factory(
    deployer
  ).deploy();

  return {
    deployer,
    alwaysTrueCondition,
  };
}
