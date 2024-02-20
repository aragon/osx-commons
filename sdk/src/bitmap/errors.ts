import {SdkError} from '../errors';

export class InvalidArraySizeError extends SdkError {
  constructor(size: number, cause?: any) {
    super(`Invalid array size: ${size}`, cause);
  }
}

export class InvalidBitMapValueError extends SdkError {
  constructor(cause?: any) {
    super('The bitmap value is too big', cause);
  }
}
