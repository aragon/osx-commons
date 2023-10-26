import { MultiUri } from '../../src';
import {
  TEST_HTTP_URI,
  TEST_INVALID_IPFS_CID,
  TEST_IPFS_CID_V0,
  TEST_IPFS_URI_V0,
} from '../constants';

describe('MultiUri', () => {
  it('Should get http and ipfs urls', () => {
    const uris = [TEST_IPFS_URI_V0, TEST_HTTP_URI];
    const cid = uris[0].substring(7);
    const multiuri = new MultiUri(uris.join(','));
    expect(multiuri.http.length).toBe(1);
    expect(multiuri.http[0]).toBe(uris[1]);
    expect(multiuri.ipfsCid).toBe(cid);
    expect(multiuri.ipfs === null).toBe(false);
    if (multiuri.ipfs) {
      expect(multiuri.ipfs.cid).toBe(cid);
    }
  });
  it('Should get an ipfs cid', () => {
    const cid = TEST_IPFS_CID_V0;
    const multiuri = new MultiUri(cid);
    expect(multiuri.http.length).toBe(0);
    expect(multiuri.ipfs === null).toBe(false);
    if (multiuri.ipfs) {
      expect(multiuri.ipfs.cid).toBe(cid);
    }
    expect(multiuri.ipfsCid).toBe(cid);
  });
  it('Should get an invalid ipfs cid and return an empty string', () => {
    const cid = TEST_INVALID_IPFS_CID;
    const multiuri = new MultiUri(cid);
    expect(multiuri.http.length).toBe(0);
    expect(multiuri.ipfs).toBe(null);
    expect(multiuri.ipfsCid).toBe(null);
  });
  it('Should get a valid ipfs uri', () => {
    const uri = TEST_IPFS_URI_V0;
    const cid = uri.substring(7);
    const multiuri = new MultiUri(uri);
    expect(multiuri.http.length).toBe(0);
    expect(multiuri.ipfs === null).toBe(false);
    if (multiuri.ipfs) {
      expect(multiuri.ipfs.cid).toBe(cid);
    }
    expect(multiuri.ipfsCid).toBe(cid);
  });
  it('Should get multiple http urls', () => {
    const uris = [
      `${TEST_HTTP_URI}/1`,
      `${TEST_HTTP_URI}/2`,
      `${TEST_HTTP_URI}/3`,
    ];
    const multiuri = new MultiUri(uris.join(','));
    expect(multiuri.http.length).toBe(uris.length);
    for (const idx in uris) {
      expect(multiuri.http[idx]).toBe(uris[idx]);
    }
    expect(multiuri.ipfs).toBe(null);
    expect(multiuri.ipfsCid).toBe(null);
  });
  it('Should get an ipfs uri with path', () => {
    const uri = `${TEST_IPFS_URI_V0}/some/path`;
    const pathCid = uri.substring(7);
    const pathIdx = pathCid.indexOf('/');
    const cid = pathCid.substring(0, pathIdx);
    const path = pathCid.substring(pathIdx);
    const multiuri = new MultiUri(uri);
    expect(multiuri.http.length).toBe(0);
    expect(multiuri.ipfs === null).toBe(false);
    if (multiuri.ipfs) {
      expect(multiuri.ipfs.cid).toBe(cid);
      expect(multiuri.ipfs.path).toBe(path);
    }
    expect(multiuri.ipfsCid).toBe(cid);
  });
  it('Should get an ipfs cid with path', () => {
    const pathCid = `${TEST_IPFS_CID_V0}/some/path`;
    const pathIdx = pathCid.indexOf('/');
    const cid = pathCid.substring(0, pathIdx);
    const path = pathCid.substring(pathIdx);
    const multiuri = new MultiUri(pathCid);
    expect(multiuri.http.length).toBe(0);
    expect(multiuri.ipfs === null).toBe(false);
    if (multiuri.ipfs) {
      expect(multiuri.ipfs.cid).toBe(cid);
      expect(multiuri.ipfs.path).toBe(path);
    }
    expect(multiuri.ipfsCid).toBe(cid);
  });
});
