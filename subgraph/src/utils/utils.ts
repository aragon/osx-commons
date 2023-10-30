import {BigInt} from '@graphprotocol/graph-ts';

/**
 * Converts a BigInt to a bytes32 string with a 64 zero padding.
 * @param input The BigInt to convert.
 * @returns The bytes32 string representation of the input BigInt.
 */
export function bigIntToBytes32(input: BigInt): string {
  const hexString = input
    .toHexString() // convert to hex, example: 0x1
    .slice(2) // remove 0x
    .padStart(64, '0'); // pad left with '0' until reaching target length of 32 bytes
  return `0x${hexString}`; // add 0x to the start
}
