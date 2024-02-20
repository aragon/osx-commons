import {SdkError} from '../errors';
import {ContractReceipt} from '@ethersproject/contracts';

export class EventNotFoundError extends SdkError {
  constructor(eventName: string, cr: ContractReceipt) {
    super(
      `Event "${eventName}" could not be found in transaction ${cr.transactionHash}.`,
      cr
    );
  }
}
