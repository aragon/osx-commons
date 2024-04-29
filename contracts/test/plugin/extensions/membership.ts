import {IMembership__factory} from '../../../typechain';
import {getInterfaceId} from '@aragon/osx-commons-sdk';
import {IMembership__factory as IMembership_V1_0_0__factory} from '@aragon/osx-ethers-v1.0.0';
import {expect} from 'chai';

describe('IMembership', function () {
  it('has the same interface ID as its initial version introduced in v1.0.0', async () => {
    const current = getInterfaceId(IMembership__factory.createInterface());
    const initial = getInterfaceId(
      IMembership_V1_0_0__factory.createInterface()
    );
    expect(current).to.equal(initial);
  });
});
