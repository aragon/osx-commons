import IPFS from 'ipfs-http-client';

const IPFS_CID_REGEX =
  /^((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

const IPFS_URI_REGEX =
  /^ipfs:\/\/((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

// TODO Revisit
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

/**
 * Checks if the given string is a valid IPFS CID
 *
 * @export
 * @param {string} cid
 * @return {*}  {string}
 */
export function isIpfsCid(cid: string): boolean {
  return IPFS_CID_REGEX.test(cid);
}
/**
 * Checks if the given string is a valid IPFS URI
 *
 * @export
 * @param {string} cid
 * @return {*}  {boolean}
 */
export function isIpfsUri(cid: string): boolean {
  return IPFS_URI_REGEX.test(cid);
}
