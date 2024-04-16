// TODO: ADD JSDOC
export enum Operation {
  Grant = 0,
  Revoke = 1,
  GrantWithCondition = 2,
}

export const PERMISSION_MANAGER_FLAGS = {
  UNSET_FLAG: `0x${'0'.repeat(40)}`, // address(0)
  ALLOW_FLAG: `0x${'0'.repeat(39)}2`, // address(2)
  ANY_ADDR: `0x${'f'.repeat(40)}`, // address(-1)
  NO_CONDITION: `0x${'0'.repeat(40)}`, // address(0)
};
