import {generateActionEntityId} from '../../src/ids/proposal';
import {DUMMY_PROPOSAL_ID} from '../constants';
import {assert, describe, test} from 'matchstick-as/assembly/index';

describe('Proposal ID generation', () => {
  test('`generateActionEntityId` should return the id representation of an action', () => {
    const proposalId = DUMMY_PROPOSAL_ID;
    const index = 0;

    const expectedId = `${proposalId}_${index}`;

    assert.stringEquals(generateActionEntityId(proposalId, index), expectedId);
  });
});
