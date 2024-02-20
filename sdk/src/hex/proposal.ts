import {
  OSX_COMPACT_PROPOSAL_ID_REGEX,
  OSX_EXTENDED_PROPOSAL_ID_REGEX,
} from './constants';

export function isExtendedProposalId(proposalId: string): boolean {
  return OSX_EXTENDED_PROPOSAL_ID_REGEX.test(proposalId);
}

export function isProposalId(proposalId: string): boolean {
  return OSX_COMPACT_PROPOSAL_ID_REGEX.test(proposalId);
}
