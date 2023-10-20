import {BytesLike, ethers} from 'ethers';
import IPFS from 'ipfs-http-client';

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
