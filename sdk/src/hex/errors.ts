import {SdkError} from '../errors';

export class InvalidHexStringError extends SdkError {
  constructor(hexString: string, cause?: Error) {
    super(`"${hexString}" is not a valid hex string.`, cause);
  }
}

export class OddLengthHexStringError extends SdkError {
  constructor(cause?: Error) {
    super('The hex string has an odd length', cause);
  }
}

export class InvalidAddressError extends SdkError {
  constructor(address: string, cause?: Error) {
    super(`"${address}" is not a valid Ethereum address.`, cause);
  }
}

export class InvalidProposalIdError extends SdkError {
  constructor(proposalId: string, cause?: Error) {
    super(`"${proposalId}" is not a valid proposal id.`, cause);
  }
}
