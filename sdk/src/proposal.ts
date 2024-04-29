/**
 * Convert a proposalId to a bytes32 string.
 *
 * @export
 * @param {number} proposalId
 * @return {*}  {string}
 */
export function proposalIdToBytes32(proposalId: number): string {
  const hex = proposalId.toString(16);
  return `0x${'0'.repeat(64 - hex.length)}${hex}`;
}
