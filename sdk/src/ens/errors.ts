import {SdkError} from '../errors';

export class UnsupportedNetworkError extends SdkError {
  constructor(network: string, cause?: any) {
    super('Unsupported network: ' + network, cause);
  }
}

export class InvalidEnsError extends SdkError {
  constructor(cause?: any) {
    super('Invalid subdomain format: use a-z, 0-9 and -', cause);
  }
}
