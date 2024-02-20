import {SdkError} from '../errors';

export class InvalidRatioValueError extends SdkError {
  constructor(ratio: number, cause?: any) {
    super(
      `The ratio value should range between 0 and 1, received value: ${ratio}`,
      cause
    );
  }
}

export class InvalidDigitsValueError extends SdkError {
  constructor(digits: number, cause?: any) {
    super(
      `The number of digits should range between 1 and 15, received value: ${digits}`,
      cause
    );
  }
}

export class ValueOutOfRangeError extends SdkError {
  constructor(cause?: any) {
    super(`The value is out of range`, cause);
  }
}
