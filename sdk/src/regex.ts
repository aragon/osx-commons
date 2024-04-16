export const IPFS_CID_REGEX =
  /^((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

export const IPFS_URI_REGEX =
  /^ipfs:\/\/((Qm[1-9A-HJ-NP-Za-km-z]{44,})|(b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,})|(z[1-9A-HJ-NP-Za-km-z]{48,})|(F[0-9A-F]{50,}))$/;

export const ENS_REGEX = /^(?:[a-z0-9-]+\.)*[a-z0-9-]+\.eth$/;
export const SUBDOMAIN_REGEX = /^[a-z0-9-]+$/;
