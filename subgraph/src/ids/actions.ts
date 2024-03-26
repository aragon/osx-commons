import {generateEntityIdFromAddress} from './ids';
import {Address} from '@graphprotocol/graph-ts';

/**
 * @param caller the user/plugin that will invoke the execute function on the DAO
 * @param daoAddress the DAO address
 * @param callId the callID determined by the user or plugin
 * @param index the index # of the action in the batch
 *
 * @returns a deterministic Action ID for an action on the DAO.
 * This implementation only relies on data that can be fetched
 * from the event logs of the `Executed` event, so can be used
 * by client applications to query both the OSx core and the plugin
 * subgraphs.
 */
export function generateActionEntityId(
  caller: Address,
  daoAddress: Address,
  callId: string,
  index: i32
): string {
  return [
    generateEntityIdFromAddress(caller),
    generateEntityIdFromAddress(daoAddress),
    callId,
    index.toString(),
  ].join('_');
}
