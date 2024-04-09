import {BytesLike, ethers} from 'ethers';
import IPFS from 'ipfs-http-client';
import {MultiUri } from './multiuri';
import {InvalidCidError} from './errors';
import {IPFS_URI_REGEX} from './constants';

export async function uploadToIPFS(content: string): Promise<string> {
  const client = IPFS.create({
    url: 'https://prod.ipfs.aragon.network/api/v0',
    headers: {
      'X-API-KEY': 'b477RhECf8s8sdM7XrkLBs2wHc4kCMwpbcFC55Kt',
    },
  });

  const res = await client.add(content);
  await client.pin.add(res.cid);
  return res.cid.toString();
}

export function toHex(input: string): BytesLike {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(input));
}

/**
 * Attempts to parse the given string as a URL and returns the IPFS CiD contained in it.
 * Alternatively it tries to use the raw value after validating it.
 *
 * @export
 * @param {string} data
 * @return {*}  {string}
 */
export function resolveIpfsCid(data: string): string {
  const uri = new MultiUri(data);
  const cid = uri.ipfsCid;
  if (!cid) {
    throw new InvalidCidError();
  }
  return cid;
}

/**
 * Checks if the given string is a valid IPFS URI
 *
 * @export
 * @param {string} cid
 * @return {*}  {boolean}
 */
export function isIpfsUri(cid: string): boolean {
  const regex = new RegExp(IPFS_URI_REGEX);
  return regex.test(cid);
}
