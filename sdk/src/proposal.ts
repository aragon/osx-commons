export function proposalIdToBytes32(proposalId: number): string {
  const hex = proposalId.toString(16);
  return `0x${'0'.repeat(64 - hex.length)}${hex}`;
}
