/* MARKDOWN
---
title: Extended context
---

## Extended contex

Use the ContextCore class to create an extended Context for you own plugin. Now you can receive a generic base context with Web3, Subgraph and IPFS capabilities add custom parameters for your client on top.

*/
import {Context, ContextCore} from '../src';

// define a custom context params
type MyContextParams = {
  myParam: string;
};

// define a custom context that extends the ContextCore class
export class MyContext extends ContextCore {
  public myParam: string;
  constructor(
    customContextParams?: Partial<MyContextParams>,
    context?: ContextCore
  ) {
    super(context);
    this.myParam = customContextParams?.myParam || 'default';
  }
}

// obtained from the host UI (Web3, Subgraph and IPFS)
const genericUiCtx: Context = new Context(/* ... */);

// define our custom context
const context1 = new MyContext({myParam: 'hello world'}, genericUiCtx);

// call extended client functions
console.log(context1.network);
console.log(context1.myParam);
// ...

/* MARKDOWN
Returns:
```tsx
matic
hello world
```
*/

// define a custom context with default values
const context2 = new MyContext();

// call extended client functions
console.log(context2.network);
console.log(context2.myParam);
// ...

/* MARKDOWN
Returns:
```tsx
mainnet
default
```
*/
