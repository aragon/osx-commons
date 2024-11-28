import dotenv from 'dotenv';
import { fetch } from 'undici';
dotenv.config();

const IPFS_CID_REGEX =
  /^((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

const IPFS_URI_REGEX =
  /^ipfs:\/\/((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

function buildFileName(fileName: string): string {
  return `osx-${fileName}.json`;
}

export async function uploadToPinata(content: string, fileName: string): Promise<string> {
  const body = {
    pinataOptions: {
      cidVersion: 1,
    },
    pinataMetadata: {
      name: buildFileName(fileName),
    },
    pinataContent: content,
  };

  const res = await fetch("https://api.pinata.cloud/pinning/pinJsonToIPFS", {
    method: "POST",
    headers: {Authorization: `Bearer ${process.env.PUB_PINATA_JWT}`, 'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  });

  const resData: { error?: string; IpfsHash?: string } | undefined = await res.json() as any;

  if (resData?.error)
    throw new Error(`Request failed: ${errorToString(resData.error)}`);
  else if (!resData?.IpfsHash) throw new Error("Could not pin the metadata");

  return `ipfs://${resData.IpfsHash}`;
}


function errorToString(error: any): string {
  return `${error.reason}: ${error.details}`;
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
