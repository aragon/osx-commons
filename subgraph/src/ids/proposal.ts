/**
 * Generates a unique action ID using the given parameters.
 *
 * @param proposalId - The id of the proposal that the action belongs to.
 * @param index - The index of the action within the proposal.
 * @returns A concatenated ID string for the Action entity.
 */
export function generateActionEntityId(
  proposalEntityId: string,
  index: i32
): string {
  const ids = [proposalEntityId, index.toString()];
  return ids.join('_');
}
