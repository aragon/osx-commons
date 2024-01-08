import {expect} from 'chai';

// TODO

describe.skip('DaoAuthorizable', async () => {
  // TODO abstract these common tests that also apply to `DaoAuthorizableUpgradeable`
  it('initializes the DAO', async () => {
    expect(true).to.equal(false);
  });

  it('authorizes calls to `auth`-modifier-protected functions', async () => {
    expect(true).to.equal(false);
  });

  it('relays the authorization to `PermissionCondition` if the permission was granted with `grantWithCondition`', async () => {
    expect(true).to.equal(false);
  });
});

describe.skip('DaoAuthorizableUpgradeable', async () => {
  // TODO run the same tests as for `DaoAuthorizable`.

  it('upgrades', async () => {
    expect(true).to.equal(false);
  });

  it('can be reinitialized', async () => {
    expect(true).to.equal(false);
  });
});
