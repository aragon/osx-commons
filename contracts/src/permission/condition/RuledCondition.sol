// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import {IPermissionCondition} from "./IPermissionCondition.sol";
import {PermissionConditionUpgradeable} from "./PermissionConditionUpgradeable.sol";

abstract contract RuledCondition is PermissionConditionUpgradeable {
    uint8 internal constant BLOCK_NUMBER_RULE_ID = 200;
    uint8 internal constant TIMESTAMP_RULE_ID = 201;
    uint8 internal constant CONDITION_RULE_ID = 202;
    uint8 internal constant LOGIC_OP_RULE_ID = 203;
    uint8 internal constant RULE_VALUE_RULE_ID = 204;

    struct Rule {
        uint8 id;
        uint8 op;
        uint240 value;
        bytes32 permissionId;
    }

    enum Op {
        NONE,
        EQ,
        NEQ,
        GT,
        LT,
        GTE,
        LTE,
        RET,
        NOT,
        AND,
        OR,
        XOR,
        IF_ELSE
    } // op types

    Rule[] private rules;

    /// @notice Checks if an interface is supported by this or its parent contract.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return
            _interfaceId == type(RuledCondition).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

    function getRules() public view virtual returns (Rule[] memory) {
        return rules;
    }

    function _updateRules(Rule[] memory _rules) internal virtual {
        delete rules;

        for (uint256 i; i < _rules.length; ) {
            rules.push(_rules[i]);
            unchecked {
                ++i;
            }
        }
    }

    function _evalRule(
        uint32 _ruleIndex,
        address _where,
        address _who,
        bytes32 _permissionId,
        uint256[] memory _compareList
    ) internal view virtual returns (bool) {
        Rule memory rule = rules[_ruleIndex];

        if (rule.id == LOGIC_OP_RULE_ID) {
            return _evalLogic(rule, _where, _who, _permissionId, _compareList);
        }

        uint256 value;
        uint256 comparedTo = uint256(rule.value);

        // get value
        if (rule.id == CONDITION_RULE_ID) {
            bytes32 permissionId = rule.permissionId;

            bool conditionRes = checkCondition(
                IPermissionCondition(address(uint160(rule.value))),
                _who,
                _where,
                permissionId == bytes32(0) ? _permissionId : permissionId,
                _compareList
            );
            value = conditionRes ? 1 : 0;
            comparedTo = 1;
        } else if (rule.id == BLOCK_NUMBER_RULE_ID) {
            value = block.number;
        } else if (rule.id == TIMESTAMP_RULE_ID) {
            value = block.timestamp;
        } else if (rule.id == RULE_VALUE_RULE_ID) {
            value = uint256(rule.value);
        } else {
            if (rule.id >= _compareList.length) {
                return false;
            }
            value = uint256(uint240(_compareList[rule.id])); // force lost precision
        }

        if (Op(rule.op) == Op.RET) {
            return uint256(value) > 0;
        }

        return compare(value, Op(rule.op), comparedTo);
    }

    function _evalLogic(
        Rule memory _rule,
        address _where,
        address _who,
        bytes32 _permissionId,
        uint256[] memory _compareList
    ) internal view virtual returns (bool) {
        if (Op(_rule.op) == Op.IF_ELSE) {
            (
                uint32 currentRuleIndex,
                uint32 ruleIndexOnSuccess,
                uint32 ruleindexOnFailure
            ) = decodeRuleValue(uint256(_rule.value));
            bool result = _evalRule(currentRuleIndex, _who, _where, _permissionId, _compareList);

            return
                _evalRule(
                    result ? ruleIndexOnSuccess : ruleindexOnFailure,
                    _where,
                    _who,
                    _permissionId,
                    _compareList
                );
        }

        uint32 param1;
        uint32 param2;

        (param1, param2, ) = decodeRuleValue(uint256(_rule.value));
        bool r1 = _evalRule(param1, _where, _who, _permissionId, _compareList);

        if (Op(_rule.op) == Op.NOT) {
            return !r1;
        }

        if (r1 && Op(_rule.op) == Op.OR) {
            return true;
        }

        if (!r1 && Op(_rule.op) == Op.AND) {
            return false;
        }

        bool r2 = _evalRule(param2, _where, _who, _permissionId, _compareList);

        if (Op(_rule.op) == Op.XOR) {
            return r1 != r2;
        }

        return r2; // both or and and depend on result of r2 after checks
    }

    function checkCondition(
        IPermissionCondition _condition,
        address _where,
        address _who,
        bytes32 _permissionId,
        uint256[] memory _compareList
    ) internal view virtual returns (bool) {
        // a raw call is required so we can return false if the call reverts, rather than reverting
        bytes memory checkCalldata = abi.encodeWithSelector(
            _condition.isGranted.selector,
            _where,
            _who,
            _permissionId,
            abi.encode(_compareList)
        );

        bool ok;
        assembly {
            // send all available gas; if the oracle eats up all the gas, we will eventually revert
            // note that we are currently guaranteed to still have some gas after the call from
            // EIP-150's 63/64 gas forward rule
            ok := staticcall(
                gas(),
                _condition,
                add(checkCalldata, 0x20),
                mload(checkCalldata),
                0,
                0
            )
        }

        if (!ok) {
            return false;
        }

        uint256 size;
        assembly {
            size := returndatasize()
        }
        if (size != 32) {
            return false;
        }

        bool result;
        assembly {
            let ptr := mload(0x40) // get next free memory ptr
            returndatacopy(ptr, 0, size) // copy return from above `staticcall`
            result := mload(ptr) // read data at ptr and set it to result
            mstore(ptr, 0) // set pointer memory to 0 so it still is the next free ptr
        }

        return result;
    }

    function compare(uint256 _a, Op _op, uint256 _b) internal pure returns (bool) {
        if (_op == Op.EQ) return _a == _b;
        if (_op == Op.NEQ) return _a != _b;
        if (_op == Op.GT) return _a > _b;
        if (_op == Op.LT) return _a < _b;
        if (_op == Op.GTE) return _a >= _b;
        if (_op == Op.LTE) return _a <= _b;
        return false;
    }

    function decodeRuleValue(uint256 _x) public pure returns (uint32 a, uint32 b, uint32 c) {
        a = uint32(_x);
        b = uint32(_x >> (8 * 4));
        c = uint32(_x >> (8 * 8));
    }

    function encodeRuleValue(
        uint256 condition,
        uint256 successRuleIndex,
        uint256 failureRuleIndex
    ) public pure returns (uint240) {
        return uint240(condition + (successRuleIndex << 32) + (failureRuleIndex << 64));
    }

    uint256[49] private __gap;
}
