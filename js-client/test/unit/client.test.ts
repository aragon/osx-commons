import {
  ClientCore,
  ContextCore,
  ContextParams,
  NoProviderError,
  NoSignerError,
} from '../../src';
import {
  DEFAULT_IPFS_ENDPOINTS,
  TEST_WALLET,
  TEST_WALLET_ADDRESS,
  web3endpoints,
} from '../constants';
import { Wallet } from '@ethersproject/wallet';

class TestContext extends ContextCore {
  constructor(params?: Partial<ContextParams>) {
    super(params);
  }
}

class TestClient extends ClientCore {
  constructor(context: TestContext) {
    super(context);
  }
}

describe('Test an extended client', () => {
  it('Should create a client with the default context parameters', async () => {
    const contextParams: ContextParams = {
      signer: new Wallet(TEST_WALLET),
      web3Providers: web3endpoints.working,
    };
    const ctx = new TestContext(contextParams);
    const client = new TestClient(ctx);
    expect(client).toBeDefined();
    expect(ctx).toBeDefined();
    expect(client.web3).toBeDefined();
    expect(client.ipfs).toBeDefined();
    expect(client.graphql).toBeDefined();
    const provider = client.web3.getProvider();
    expect(provider).toBeDefined();

    const networkName = client.web3.getNetworkName();
    expect(networkName).toBe('homestead');

    const signer = client.web3.getConnectedSigner();
    expect(signer).toBeDefined();
    expect(await signer.getAddress()).toBe(TEST_WALLET_ADDRESS);

    const ipfsClient = client.ipfs.getClient();
    expect(ipfsClient).toBeDefined();
    expect(DEFAULT_IPFS_ENDPOINTS.includes(ipfsClient.url.toString())).toBe(
      true
    );

    const graphqlClient = client.graphql.getClient();
    expect(graphqlClient).toBeDefined();
  });

  it('Should create a client without signer and provider', async () => {
    const ctx = new TestContext();
    const client = new TestClient(ctx);
    expect(client).toBeDefined();
    expect(ctx).toBeDefined();
    expect(client.web3).toBeDefined();
    expect(client.ipfs).toBeDefined();
    expect(client.graphql).toBeDefined();

    const networkName = client.web3.getNetworkName();
    expect(networkName).toBe('homestead');

    expect(() => client.web3.getProvider()).toThrowError(NoProviderError);
    expect(() => client.web3.getConnectedSigner()).toThrowError(NoSignerError);

    const ipfsClient = client.ipfs.getClient();
    expect(ipfsClient).toBeDefined();
    expect(DEFAULT_IPFS_ENDPOINTS.includes(ipfsClient.url.toString())).toBe(
      true
    );

    const graphqlClient = client.graphql.getClient();
    expect(graphqlClient).toBeDefined();
  });

  it('Should create a client with baseGoerli context parameters', async () => {
    const contextParams: ContextParams = {
      network: 'baseGoerli',
      signer: new Wallet(TEST_WALLET),
      web3Providers: 'https://goerli.base.org',
    };
    const ctx = new TestContext(contextParams);
    const client = new TestClient(ctx);
    expect(client).toBeDefined();
    expect(ctx).toBeDefined();
    expect(client.web3).toBeDefined();
    expect(client.ipfs).toBeDefined();
    expect(client.graphql).toBeDefined();

    const networkName = client.web3.getNetworkName();
    expect(networkName).toBe('baseGoerli');
    const signer = client.web3.getConnectedSigner();
    expect(signer).toBeDefined();
    expect(await signer.getAddress()).toBe(TEST_WALLET_ADDRESS);

    const ipfsClient = client.ipfs.getClient();
    expect(ipfsClient).toBeDefined();
    expect(DEFAULT_IPFS_ENDPOINTS.includes(ipfsClient.url.toString())).toBe(
      true
    );

    const graphqlClient = client.graphql.getClient();
    expect(graphqlClient).toBeDefined();
  });
});
