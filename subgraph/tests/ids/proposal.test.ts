import {
  generateProposalEntityId,
  generateTransactionActionsProposalEntityId,
} from "../../src/ids/proposal";
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts";
import { assert, describe, test } from "matchstick-as";
import { ADDRESS_ONE, DUMMY_BYTES32_HEX, DUMMY_PROPOSAL_ID } from "../constants";
import { bigIntToBytes32 } from "../../src/utils/utils";

describe("Transaction Actions Proposal ID generation", () => {
  test('`generateActionEntityId` should return the id representation of an action', () => {
    const proposalId = DUMMY_PROPOSAL_ID;
    const index = 0;

    const expectedId = `${proposalId}_${index}`;

    assert.stringEquals(generateActionEntityId(proposalId, index), expectedId);
  })
  test("`generateTransactionActionsProposalEntityId` should return the id representation of a transaction actions proposal", () => {
    const proposalEntityId = generateProposalEntityId(
      Address.fromString(ADDRESS_ONE),
      BigInt.fromI32(1),
    );
    const txHash = Bytes.fromHexString(DUMMY_BYTES32_HEX);
    const logIndex = BigInt.fromI32(1);

    const expectedId =
      `${proposalEntityId}_${txHash.toHexString()}_${logIndex.toHexString()}`;

    assert.stringEquals(
      generateTransactionActionsProposalEntityId(
        proposalEntityId,
        txHash,
        logIndex,
      ),
      expectedId,
    );
  });
  test("`generateProposalEntityId` should return the id representation of a proposal", () => {
    const plugin = Address.fromString(ADDRESS_ONE);
    const proposalId = BigInt.fromI32(1);

    const expectedId = `${plugin.toHexString()}_${bigIntToBytes32(proposalId)}`;
    assert.stringEquals(
      generateProposalEntityId(plugin, proposalId),
      expectedId,
    );
  });
});
