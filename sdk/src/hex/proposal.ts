import {
  OSX_COMPACT_PROPOSAL_ID_REGEX,
  OSX_EXTENDED_PROPOSAL_ID_REGEX,
} from './constants';

/**
 * Checks if a given string has the extended proposal id format used in subgraph
 *
 * @export
 * @param {string} proposalId
 * @return {boolean}
 */
export function isExtendedProposalId(proposalId: string): boolean {
  return OSX_EXTENDED_PROPOSAL_ID_REGEX.test(proposalId);
}

/**
 * Checks if a given string has the compact proposal id format used in the App and SDK
 *
 * @export
 * @param {string} proposalId
 * @return {boolean}
 */
export function isProposalId(proposalId: string): boolean {
  return OSX_COMPACT_PROPOSAL_ID_REGEX.test(proposalId);
}
