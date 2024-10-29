import {
  RuledConditionMock,
  RuledConditionMock__factory,
  PermissionConditionMock,
  PermissionConditionMock__factory,
  DAOMock,
  DAOMock__factory,
  IPermissionCondition__factory,
} from '../../../../typechain';
import {RulesUpdatedEvent} from '../../../../typechain/src/permission/condition/extensions/RuledCondition';
import {erc165ComplianceTests} from '../../../helpers';
import {
  BLOCK_NUMBER_RULE_ID,
  TIMESTAMP_RULE_ID,
  CONDITION_RULE_ID,
  LOGIC_OP_RULE_ID,
  VALUE_RULE_ID,
  DUMMY_PERMISSION_ID,
  Op,
} from '../../../utils/condition/condition';
import {findEvent, getInterfaceId} from '@aragon/osx-commons-sdk';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('RuledCondition', async () => {
  it('updates the rules and emits the event', async () => {
    const {conditionMock} = await loadFixture(fixture);

    const newRules = [
      {
        id: CONDITION_RULE_ID,
        op: Op.EQ,
        value: 777,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ];
    const tx = await conditionMock.updateRules(newRules);
    const event = findEvent<RulesUpdatedEvent>(await tx.wait(), 'RulesUpdated');
    expect(event.args.rules).to.deep.equal([
      [
        newRules[0].id,
        newRules[0].op,
        newRules[0].value,
        newRules[0].permissionId,
      ],
    ]);

    const rules = await conditionMock.getRules();
    expect(rules.length).to.equal(1);
    expect(rules[0].id).to.equal(202);
    expect(rules[0].op).to.equal(1);
    expect(rules[0].value).to.equal(777);
    expect(rules[0].permissionId).to.equal(DUMMY_PERMISSION_ID);
  });

  it('should be able to eval simple rule (evaluation is true)', async () => {
    const {deployer, daoMock, conditionMock, subConditionA} = await loadFixture(
      fixture
    );

    await expect(
      conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.reverted;

    // configure a simple rule in the condition
    await conditionMock.updateRules([
      {
        id: CONDITION_RULE_ID,
        op: Op.EQ,
        value: subConditionA.address,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);

    // set answer to true in mock condition
    await subConditionA.setAnswer(true);

    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;
  });

  it('should be able to eval simple rule (evaluation is false)', async () => {
    const {deployer, daoMock, conditionMock, subConditionA} = await loadFixture(
      fixture
    );

    // configure a simple rule in the condition
    await conditionMock.updateRules([
      {
        id: CONDITION_RULE_ID,
        op: Op.EQ,
        value: subConditionA.address,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);

    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('should be able to eval complex rule (evaluation is true)', async () => {
    const {
      deployer,
      daoMock,
      conditionMock,
      subConditionA,
      subConditionB,
      subConditionC,
    } = await loadFixture(fixture);

    // configure a complex  rule in the condition  C || (A && B)
    await conditionMock.updateRules(
      C_or_B_and_A_rule(
        conditionMock,
        subConditionA,
        subConditionB,
        subConditionC
      )
    );

    // set answer to true in mock condition A and B
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(true);

    // C || (A && B) => C(false) || (A(true) && B(true)) => true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // set answer to true in mock condition C
    await subConditionC.setAnswer(true);
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(false);

    // C || (A && B) => C(true) || (A(false) && B(false)) => true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;
  });

  it('should be able to eval complex rule (evaluation is false)', async () => {
    const {
      deployer,
      daoMock,
      conditionMock,
      subConditionA,
      subConditionB,
      subConditionC,
    } = await loadFixture(fixture);

    // configure a complex  rule in the condition  C || (A && B)
    await conditionMock.updateRules(
      C_or_B_and_A_rule(
        conditionMock,
        subConditionA,
        subConditionB,
        subConditionC
      )
    );

    // set answer to true in mock condition A and B
    await subConditionA.setAnswer(true);

    // C || (A && B) => C(false) || (A(true) && B(false)) => false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it(`evaluates 'if/else' on sub-conditions and only returns true if at least one of them returns true`, async () => {
    const {deployer, daoMock, subConditionA, subConditionB, conditionMock} =
      await loadFixture(fixture);

    // checks the block number is bigger or equal than 1
    await conditionMock.updateRules(
      if_A_else_B(conditionMock, subConditionA, subConditionB)
    );

    // since both sub-conditions return false, our condition also returns false.
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;

    // This now must return true because `if` condition is true.
    await subConditionA.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // This now must return true because `else` condition is true.
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;
  });

  it('should be able to eval rule that checks blockNumber', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    // checks the block number is bigger or equal than 1
    await conditionMock.updateRules([
      {
        id: BLOCK_NUMBER_RULE_ID,
        op: Op.GTE,
        value: 1,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // checks the block number is lower than 1
    await conditionMock.updateRules([
      {
        id: BLOCK_NUMBER_RULE_ID,
        op: Op.LT,
        value: 1,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('should be able to eval rule that checks timestamp', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    // checks the timestamp is bigger or equal than 1
    await conditionMock.updateRules([
      {
        id: TIMESTAMP_RULE_ID,
        op: Op.GTE,
        value: 1,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // checks the timestamp is lower than 1
    await conditionMock.updateRules([
      {
        id: TIMESTAMP_RULE_ID,
        op: Op.LT,
        value: 1,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('evaluates AND operation', async () => {
    const {deployer, daoMock, conditionMock, subConditionA, subConditionB} =
      await loadFixture(fixture);

    await conditionMock.updateRules(
      logic_rule(conditionMock, Op.AND, subConditionA, subConditionB)
    );

    // true AND true should return true
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // false AND true should return false
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;

    // false AND false should return false
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(false);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;

    // true AND false should return false
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(false);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('evaluates OR operation', async () => {
    const {deployer, daoMock, conditionMock, subConditionA, subConditionB} =
      await loadFixture(fixture);

    await conditionMock.updateRules(
      logic_rule(conditionMock, Op.OR, subConditionA, subConditionB)
    );

    // true OR false should return true
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(false);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // false OR true should return true
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // true OR true should return true
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // false OR false should return false
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(false);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('evaluates XOR operation', async () => {
    const {deployer, daoMock, conditionMock, subConditionA, subConditionB} =
      await loadFixture(fixture);

    await conditionMock.updateRules(
      logic_rule(conditionMock, Op.XOR, subConditionA, subConditionB)
    );

    // true XOR false should return true
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(false);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // false XOR true should return true
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    // false XOR false should return false
    await subConditionA.setAnswer(false);
    await subConditionB.setAnswer(false);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;

    // true XOR true should return false
    await subConditionA.setAnswer(true);
    await subConditionB.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('evaluates NOT operation', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    await conditionMock.updateRules(not_rule(conditionMock, 0));

    // value is 0, so NOT 0 is true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.true;

    await conditionMock.updateRules(not_rule(conditionMock, 1));

    // value is 1, so NOT 1 is false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        '0x'
      )
    ).to.be.false;
  });

  it('evaluates EQ operation', async () => {
    const {deployer, daoMock, conditionMock, subConditionA} = await loadFixture(
      fixture
    );

    const value = 1;

    await conditionMock.updateRules(comparison_rule(Op.EQ, value));

    let list = [1, 2, 3];
    // 1 == 1 should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [2, 2, 3];
    // 2 != 1 should return false
    await subConditionA.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it('evaluates NEQ operation', async () => {
    const {deployer, daoMock, conditionMock, subConditionA} = await loadFixture(
      fixture
    );

    const value = 1;

    await conditionMock.updateRules(comparison_rule(Op.NEQ, value));

    let list = [2, 2, 3];
    // 2 != 1 should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [1, 2, 3];
    // 1 == 1 should return false
    await subConditionA.setAnswer(true);
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it('evaluates GT operation', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    const value = 5;
    await conditionMock.updateRules(comparison_rule(Op.GT, value));

    let list = [10, 20, 30];
    // 10 > 5 should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [1, 2, 3];
    // 1 < 5 should return false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it('evaluates GTE operation', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    const value = 10;
    await conditionMock.updateRules(comparison_rule(Op.GTE, value));

    let list = [10, 20, 30];
    // 10 >= 10 should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [1, 2, 3];
    // 1 < 10 should return false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it('evaluates LT operation', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    const value = 10;
    await conditionMock.updateRules(comparison_rule(Op.LT, value));

    let list = [1, 2, 3];
    // 1 < 10 should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [11, 20, 33];
    // 11 > 10 should return false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it('evaluates LTE operation', async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    const value = 10;
    await conditionMock.updateRules(comparison_rule(Op.LTE, value));

    let list = [10, 20, 30];
    // 10 <= 10 should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [11, 20, 30];
    // 11 > 10 should return false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it(`should return false if operation is NONE`, async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    const list = [1, 2, 3];
    await conditionMock.updateRules([
      {
        // compare list
        id: 1, // index of the compare list
        op: Op.NONE,
        value: list[1],
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);

    // since list is ordered should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it(`evaluates rule with compare list operation`, async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    let list = [1, 2, 3];
    await conditionMock.updateRules(
      three_elements_list_ordered_rule(conditionMock, list)
    );

    // since list is ordered should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.true;

    list = [3, 2, 1];
    await conditionMock.updateRules(
      three_elements_list_ordered_rule(conditionMock, list)
    );
    // list is not ordered should return false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;

    list = [2, 3, 1];
    await conditionMock.updateRules(
      three_elements_list_ordered_rule(conditionMock, list)
    );
    // list is not ordered should return false
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  it(`should return false if id bigger than compare list length`, async () => {
    const {deployer, daoMock, conditionMock} = await loadFixture(fixture);

    const list = [1, 2, 3];
    await conditionMock.updateRules([
      {
        // compare list
        id: 5, // index of the compare list
        op: Op.LTE,
        value: list[1],
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);

    // since list is ordered should return true
    expect(
      await conditionMock.isGranted(
        daoMock.address,
        deployer.address,
        DUMMY_PERMISSION_ID,
        ethers.utils.defaultAbiCoder.encode(['uint256[]'], [list])
      )
    ).to.be.false;
  });

  describe('ERC-165', async () => {
    it('supports the `ERC-165` standard', async () => {
      const {deployer, conditionMock} = await loadFixture(fixture);
      await erc165ComplianceTests(conditionMock, deployer);
    });

    it('supports the `IPermissionCondition` interface', async () => {
      const {conditionMock} = await loadFixture(fixture);
      const iface = IPermissionCondition__factory.createInterface();
      expect(await conditionMock.supportsInterface(getInterfaceId(iface))).to.be
        .true;
    });
  });
});

type FixtureResult = {
  deployer: SignerWithAddress;
  daoMock: DAOMock;
  conditionMock: RuledConditionMock;
  subConditionA: PermissionConditionMock;
  subConditionB: PermissionConditionMock;
  subConditionC: PermissionConditionMock;
};

function if_A_else_B(
  conditionMock: RuledConditionMock,
  subConditionA: PermissionConditionMock,
  subConditionB: PermissionConditionMock
) {
  return [
    {
      id: LOGIC_OP_RULE_ID,
      op: Op.IF_ELSE,
      value: conditionMock.encodeIfElse(1, 2, 3),
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionA.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: VALUE_RULE_ID,
      op: Op.RET,
      value: 1,
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionB.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
  ];
}

function logic_rule(
  conditionMock: RuledConditionMock,
  operation: Op,
  subConditionA: PermissionConditionMock,
  subConditionB: PermissionConditionMock
) {
  return [
    {
      id: LOGIC_OP_RULE_ID,
      op: operation,
      value: conditionMock.encodeLogicalOperator(1, 2),
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionA.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionB.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
  ];
}

function not_rule(conditionMock: RuledConditionMock, value: number) {
  return [
    {
      id: LOGIC_OP_RULE_ID,
      op: Op.NOT,
      value: conditionMock.encodeLogicalOperator(1, 2),
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: VALUE_RULE_ID,
      op: Op.RET,
      value: value,
      permissionId: DUMMY_PERMISSION_ID,
    },
  ];
}

function comparison_rule(operation: Op, value: number) {
  return [
    {
      // compare list
      id: 0, // index of the compare list
      op: operation,
      value: value,
      permissionId: DUMMY_PERMISSION_ID,
    },
  ];
}

function C_or_B_and_A_rule(
  conditionMock: RuledConditionMock,
  subConditionA: PermissionConditionMock,
  subConditionB: PermissionConditionMock,
  subConditionC: PermissionConditionMock
) {
  return [
    {
      id: LOGIC_OP_RULE_ID,
      op: Op.OR,
      value: conditionMock.encodeLogicalOperator(1, 2), // indx 1 and indx 2 encoded
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionC.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: LOGIC_OP_RULE_ID,
      op: Op.AND,
      value: conditionMock.encodeLogicalOperator(3, 4), // indx 3 and indx 4 encoded
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionA.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: CONDITION_RULE_ID,
      op: Op.EQ,
      value: subConditionB.address,
      permissionId: DUMMY_PERMISSION_ID,
    },
  ];
}

function three_elements_list_ordered_rule(
  conditionMock: RuledConditionMock,
  list: number[]
) {
  // ordered list of 3 elements
  return [
    {
      id: LOGIC_OP_RULE_ID,
      op: Op.AND,
      value: conditionMock.encodeLogicalOperator(1, 2), // indx 1 and indx 2 encoded,
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      // compare list
      id: 0, // index of the compare list
      op: Op.LTE,
      value: list[1],
      permissionId: DUMMY_PERMISSION_ID,
    },
    {
      id: 1, // index of the compare list
      op: Op.LTE,
      value: list[2],
      permissionId: DUMMY_PERMISSION_ID,
    },
  ];
}

async function fixture(): Promise<FixtureResult> {
  const [deployer] = await ethers.getSigners();

  const daoMock = await new DAOMock__factory(deployer).deploy();

  const conditionMock = await new RuledConditionMock__factory(
    deployer
  ).deploy();

  const subConditionA = await new PermissionConditionMock__factory(
    deployer
  ).deploy();
  const subConditionB = await new PermissionConditionMock__factory(
    deployer
  ).deploy();
  const subConditionC = await new PermissionConditionMock__factory(
    deployer
  ).deploy();

  return {
    deployer,
    daoMock,
    conditionMock,
    subConditionA,
    subConditionB,
    subConditionC,
  };
}
