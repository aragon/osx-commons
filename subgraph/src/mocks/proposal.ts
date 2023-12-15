import {Address, BigInt, ethereum} from '@graphprotocol/graph-ts';
import {createMockedFunction} from 'matchstick-as';

/**
 * Creates a mock call a contract's `getProposal` function.
 *
 * @export
 * @param {string} contractAddress
 * @param {string} proposalId
 * @param {boolean} open
 * @param {boolean} executed
 * @param {string} votingMode
 * @param {string} supportThreshold
 * @param {string} minVotingPower
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} snapshotBlock
 * @param {string} abstain
 * @param {string} yes
 * @param {string} no
 * @param {ethereum.Tuple[]} actions
 * @param {string} allowFailureMap
 */
export function createGetProposalCall(
  contractAddress: string,
  proposalId: string,
  open: boolean,
  executed: boolean,

  votingMode: string,
  supportThreshold: string,
  minVotingPower: string,
  startDate: string,
  endDate: string,
  snapshotBlock: string,

  abstain: string,
  yes: string,
  no: string,

  actions: ethereum.Tuple[],
  allowFailureMap: string
): void {
  // Proposal parameters
  const parameters = new ethereum.Tuple();
  parameters.push(
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(votingMode))
  );
  parameters.push(
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(supportThreshold))
  );
  parameters.push(
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(startDate))
  );
  parameters.push(
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(endDate))
  );
  parameters.push(
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(snapshotBlock))
  );
  parameters.push(
    ethereum.Value.fromUnsignedBigInt(BigInt.fromString(minVotingPower))
  );

  // Tally
  const tally = new ethereum.Tuple();
  tally.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString(abstain)));
  tally.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString(yes)));
  tally.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromString(no)));

  createMockedFunction(
    Address.fromString(contractAddress),
    'getProposal',
    'getProposal(uint256):(bool,bool,(uint8,uint32,uint64,uint64,uint64,uint256),(uint256,uint256,uint256),(address,uint256,bytes)[],uint256)'
  )
    .withArgs([
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(proposalId)),
    ])
    .returns([
      ethereum.Value.fromBoolean(open),
      ethereum.Value.fromBoolean(executed),
      // ProposalParameters
      ethereum.Value.fromTuple(parameters),
      // Tally
      ethereum.Value.fromTuple(tally),
      ethereum.Value.fromTupleArray(actions),
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(allowFailureMap)),
    ]);
}

/**
 * Creates a mock call a contract's `totalVotingPower` function in a specific block.
 *
 * @export
 * @param {string} contractAddress
 * @param {string} blockNumber
 * @param {string} totalVotingPower
 */
export function createTotalVotingPowerCall(
  contractAddress: string,
  blockNumber: string,
  totalVotingPower: string
): void {
  createMockedFunction(
    Address.fromString(contractAddress),
    'totalVotingPower',
    'totalVotingPower(uint256):(uint256)'
  )
    .withArgs([
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(blockNumber)),
    ])
    .returns([
      ethereum.Value.fromUnsignedBigInt(BigInt.fromString(totalVotingPower)),
    ]);
}
