import {
  InvalidAddressError,
  InvalidProposalIdError,
  OSX_COMPACT_PROPOSAL_ID_REGEX,
  isAddress,
  isExtendedProposalId,
  isProposalId,
  strip0x,
} from '../hex';
import {hexZeroPad} from '@ethersproject/bytes';

/**
 * Encodes the particles of a proposalId into a globally unique value for subgraph
 *
 * @export
 * @param {string} pluginAddress
 * @param {number} id
 * @return {string}
 */
export function encodeProposalId(pluginAddress: string, id: number) {
  if (!isAddress(pluginAddress)) {
    throw new InvalidAddressError(pluginAddress);
  }
  return `${pluginAddress}_0x${id.toString(16)}`;
}

/**
 * Decodes a proposalId from subgraph and returns the original pluginAddress and the nonce
 *
 * @export
 * @param {string} proposalId
 * @return {string} pluginAddress
 * @return {number} id
 */
export function decodeProposalId(proposalId: string): {
  pluginAddress: string;
  id: number;
} {
  if (!isProposalId(proposalId)) {
    throw new InvalidProposalIdError(proposalId);
  }

  const matchedRegexResult =
    proposalId.match(OSX_COMPACT_PROPOSAL_ID_REGEX) || [];
  if (matchedRegexResult.length !== 3) {
    throw new InvalidProposalIdError(proposalId);
  }

  const pluginAddress = matchedRegexResult[1];
  const hexProposalNonce = matchedRegexResult[2];

  return {
    pluginAddress,
    id: parseInt(strip0x(hexProposalNonce), 16),
  };
}

/**
 * Gets the extended version of a proposal id from the compact one
 *
 * @export
 * @param {string} proposalId
 * @returns {string}
 */
export const getExtendedProposalId = (proposalId: string): string => {
  if (!isProposalId(proposalId)) {
    throw new InvalidProposalIdError(proposalId);
  }
  const splits = proposalId.split('_');
  return splits[0].toLowerCase() + '_' + hexZeroPad(splits[1], 32);
};

/**
 * Gets the compact version of a proposal id from the extended one
 *
 * @export
 * @param {string} proposalId
 * @returns {string}
 */
export const getCompactProposalId = (proposalId: string): string => {
  if (!isExtendedProposalId(proposalId)) {
    throw new InvalidProposalIdError(proposalId);
  }
  const splits = proposalId.split('_');
  return splits[0].toLowerCase() + '_0x' + parseInt(splits[1]).toString(16);
};
