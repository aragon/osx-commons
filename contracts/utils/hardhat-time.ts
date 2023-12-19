import {ethers} from 'hardhat';

// TODO provide hre or provider as an input argument

export async function timestampIn(durationInSec: number): Promise<number> {
  return (await ethers.provider.getBlock('latest')).timestamp + durationInSec;
}

export async function setTimeForNextBlock(timestamp: number): Promise<void> {
  await ethers.provider.send('evm_setNextBlockTimestamp', [timestamp]);
}

export const ONE_HOUR = 60 * 60;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_YEAR = 365 * ONE_DAY;

export const MAX_UINT64 = ethers.BigNumber.from(2).pow(64).sub(1);

export async function getTime(): Promise<number> {
  return (await ethers.provider.getBlock('latest')).timestamp;
}

export async function advanceTimeTo(timestamp: number) {
  const delta = timestamp - (await getTime());
  await advanceTimeBy(delta);
}

export async function advanceTimeBy(time: number) {
  await ethers.provider.send('evm_increaseTime', [time]);
  await ethers.provider.send('evm_mine', []);
}
