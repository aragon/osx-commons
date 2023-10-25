import { ContextCore } from './context-core';
import { ContextParams } from './types';

// Basic implementation of the contex extending ContextCore
export class Context extends ContextCore {
  constructor(params?: Partial<ContextParams>) {
    super(params);
  }
}
