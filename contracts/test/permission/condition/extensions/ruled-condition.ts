import {
  RuledConditionMock,
  RuledConditionMock__factory,
  PermissionConditionMock,
  PermissionConditionMock__factory,
  DAOMock,
  DAOMock__factory,
} from '../../../../typechain';
import {
  BLOCK_NUMBER_RULE_ID,
  TIMESTAMP_RULE_ID,
  CONDITION_RULE_ID,
  LOGIC_OP_RULE_ID,
  DUMMY_PERMISSION_ID,
  Op,
} from '../../../utils/condition/condition';
import {loadFixture} from '@nomicfoundation/hardhat-network-helpers';
import {SignerWithAddress} from '@nomiclabs/hardhat-ethers/signers';
import {expect} from 'chai';
import {ethers} from 'hardhat';

describe('RuledCondition', async () => {
  it('it should be able to update the condition rules', async () => {
    const {conditionMock} = await loadFixture(fixture);

    await conditionMock.updateRules([
      {
        id: CONDITION_RULE_ID,
        op: Op.EQ,
        value: 777,
        permissionId: DUMMY_PERMISSION_ID,
      },
    ]);

    const rules = await conditionMock.getRules();
    expect(rules.length).to.equal(1);
    expect(rules[0].id).to.equal(202);
    expect(rules[0].op).to.equal(1);
    expect(rules[0].value).to.equal(777);
    expect(rules[0].permissionId).to.equal(DUMMY_PERMISSION_ID);
  });

  it('it should be able to eval simple rule (evaluation is true)', async () => {
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

  it('it should be able to eval simple rule (evaluation is false)', async () => {
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

  it('it should be able to eval complex rule (evaluation is true)', async () => {
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
      C_or_B_and_A_Rule(
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
  });

  it('it should be able to eval complex rule (evaluation is false)', async () => {
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
      C_or_B_and_A_Rule(
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

  it('it should be able to eval rule that checks blockNumber', async () => {
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

  it('it should be able to eval rule that checks timestamp', async () => {
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
});

type FixtureResult = {
  deployer: SignerWithAddress;
  daoMock: DAOMock;
  conditionMock: RuledConditionMock;
  subConditionA: PermissionConditionMock;
  subConditionB: PermissionConditionMock;
  subConditionC: PermissionConditionMock;
};

function C_or_B_and_A_Rule(
  conditionMock: RuledConditionMock,
  subConditionA: PermissionConditionMock,
  subConditionB: PermissionConditionMock,
  subConditionC: PermissionConditionMock
) {
  return [
    {
      id: LOGIC_OP_RULE_ID,
      op: Op.OR,
      value: conditionMock.encodeRuleValue(1, 2, 3), // indx 1 and idx 2 encoded
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
      value: conditionMock.encodeRuleValue(3, 4, 5), // indx 3 and idx 4 encoded
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
