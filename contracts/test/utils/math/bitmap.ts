import {BitmapMock, BitmapMock__factory} from '../../../typechain';
import {expect} from 'chai';
import {BigNumber} from 'ethers';
import {ethers} from 'hardhat';

describe('Bitmap', function () {
  const bitmapWithZerosOnly = ethers.constants.Zero;
  const bitmapWithOnesOnly = ethers.constants.MaxUint256;
  let bitmapMock: BitmapMock;

  before(async () => {
    const [deployer] = await ethers.getSigners();
    bitmapMock = await new BitmapMock__factory(deployer).deploy();
  });

  context('hasBits', function () {
    it('returns correct values for an example bitmap with value 6', async () => {
      const bitmap = 6;
      // ... 0 0 0 1 1 0 // the value 6 in binary representation from right to left
      // ... 5 4 3 2 1 0 // the indices of the action array items that are allowed to fail.

      expect(await bitmapMock.hasBit(bitmap, 0)).to.be.false; // binary 1
      expect(await bitmapMock.hasBit(bitmap, 1)).to.be.true; //  binary 2
      expect(await bitmapMock.hasBit(bitmap, 2)).to.be.true; //  binary 4
      expect(await bitmapMock.hasBit(bitmap, 3)).to.be.false; // binary 8
    });

    it('returns correct values for a bitmap composed of zeros only', async () => {
      for (let index = 0; index < 256; index++) {
        expect(await bitmapMock.hasBit(bitmapWithZerosOnly, index)).to.be.false;
      }
    });

    it('returns correct values for a bitmap composed of ones only', async () => {
      for (let index = 0; index < 256; index++) {
        expect(await bitmapMock.hasBit(bitmapWithOnesOnly, index)).to.be.true;
      }
    });
  });

  context('flipBits', function () {
    it('flips bits from 0 to 1', async () => {
      let bitmap = bitmapWithZerosOnly;
      expect(bitmap).to.equal(0);

      // flip first bit
      expect(await bitmapMock.hasBit(bitmap, 0)).to.be.false;
      bitmap = await bitmapMock.flipBit(bitmap, 0);
      expect(bitmap).to.equal(1);
      expect(await bitmapMock.hasBit(bitmap, 0)).to.be.true;

      // flip second bit
      expect(await bitmapMock.hasBit(bitmap, 1)).to.be.false;
      bitmap = await bitmapMock.flipBit(bitmap, 1);
      expect(bitmap).to.equal(3);
      expect(await bitmapMock.hasBit(bitmap, 1)).to.be.true;
    });

    it('flips bits from 1 to 0', async () => {
      let bitmap = BigNumber.from(3);

      // flip first bit
      expect(await bitmapMock.hasBit(bitmap, 0)).to.be.true;
      bitmap = await bitmapMock.flipBit(bitmap, 0);
      expect(bitmap).to.equal(2);
      expect(await bitmapMock.hasBit(bitmap, 0)).to.be.false;

      // flip second bit
      expect(await bitmapMock.hasBit(bitmap, 1)).to.be.true;
      bitmap = await bitmapMock.flipBit(bitmap, 1);
      expect(bitmap).to.equal(0);
      expect(await bitmapMock.hasBit(bitmap, 1)).to.be.false;
    });
  });
});
