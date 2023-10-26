/* MARKDOWN
---
title: Extended client
---

## Extended client

Use the ClientCore class to create an extended client. Now you can add your custom functions and properties to the client.

*/
import { ClientCore } from "../src";
import { MyContext } from "./01-extended-context";

// define a custom client that extends the ClientCore class
class MyClient extends ClientCore {
  protected myParam: string;
  constructor(ctx: MyContext) {
    super(ctx);
    this.myParam = ctx.myParam;
  }

  public customFunction() {
    return "hello world";
  }

  public async customFunction2() {
    // Use the primitives provided by the ClientCore class
    const signer = this.web3.getConnectedSigner();
    const provider = this.web3.getProvider();
    const graphqlClient = this.graphql.getClient();
    const ipfsClient = this.ipfs.getClient();

    console.log(signer);
    console.log(provider);
    console.log(graphqlClient);

    // ...
  }

  public customFunction3() {
    return this.myParam;
  }
}

// define a custom context with default values
const context = new MyContext();
// define a custom client
const client = new MyClient(context);

// call extended client functions
console.log(client.customFunction());
console.log(client.customFunction3());

/* MARKDOWN
Returns:
```tsx
hello world
default
```
*/
