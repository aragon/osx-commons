import {ContractReceipt} from '@ethersproject/contracts';

export class SdkError extends Error {
  public cause?: Error | string;
  constructor(message: string, cause?: any) {
    super(message);
    if (typeof cause === 'string') {
      this.cause = cause;
    } else if (cause instanceof Error) {
      this.cause = cause.message;
    }
  }
}

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

export class EventNotFoundError extends SdkError {
  constructor(eventName: string, contractReceipt: ContractReceipt) {
    super(
      `Event "${eventName}" could not be found in transaction ${contractReceipt.transactionHash}.`,
      contractReceipt
    );
  }
}

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

export class InvalidBitPositionError extends SdkError {
  constructor(position: number, cause?: any) {
    super(
      `Invalid bit position ${position}, minimum is 0 and maximum is 255`,
      cause
    );
  }
}

export class InvalidAddressError extends SdkError {
  constructor(address: string, cause?: any) {
    super(`Invalid address: ${address}`, cause);
  }
}
