export type MetadataAbiInput = {
  name: string;
  type: string;
  internalType: string;
  description: string;
  components?: MetadataAbiInput[];
};

/**
 * Gets the named types from a metadata abi input
 *
 * @export
 * @param {MetadataAbiInput[]} [inputs=[]]
 * @return {*}  {string[]}
 */
export function getNamedTypesFromMetadata(
  inputs: MetadataAbiInput[] = []
): string[] {
  return inputs.map(input => {
    if (input.type.startsWith('tuple')) {
      const tupleResult = getNamedTypesFromMetadata(input.components).join(
        ', '
      );

      let tupleString = `tuple(${tupleResult})`;

      if (input.type.endsWith('[]')) {
        tupleString = tupleString.concat('[]');
      }

      return tupleString;
    } else if (input.type.endsWith('[]')) {
      const baseType = input.type.slice(0, -2);
      return `${baseType}[] ${input.name}`;
    } else {
      return `${input.type} ${input.name}`;
    }
  });
}
