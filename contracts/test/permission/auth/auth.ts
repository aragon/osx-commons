import {expect} from 'chai';

describe.skip('auth', async () => {
  it('reverts with an error if the permission is not granted', async () => {
    expect(true).to.equal(false);
  });

  it('passes if the permission is granted', async () => {
    expect(true).to.equal(false);
  });

  it('relays the authorization to `PermissionCondition` if the permission was granted with `grantWithCondition`', async () => {
    expect(true).to.equal(false);
  });
});
