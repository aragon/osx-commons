import { Context } from './context';
import {
  GraphqlModule,
  IClientCore,
  IClientGraphQLCore,
  IClientIpfsCore,
  IClientWeb3Core,
  IPFSModule,
  Web3Module,
} from './internal';

/**
 * Provides the low level foundation so that subclasses have ready-made access to Web3, IPFS and GraphQL primitives
 */
export abstract class ClientCore implements IClientCore {
  public web3: IClientWeb3Core;
  public ipfs: IClientIpfsCore;
  public graphql: IClientGraphQLCore;
  constructor(context: Context) {
    this.web3 = new Web3Module(context);
    this.ipfs = new IPFSModule(context);
    this.graphql = new GraphqlModule(context);
  }
}
