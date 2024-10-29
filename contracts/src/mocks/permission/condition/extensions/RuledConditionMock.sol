// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;
import {RuledCondition} from "../../../../permission/condition/extensions/RuledCondition.sol";
import {DaoAuthorizableUpgradeable} from "../../../../permission/auth/DaoAuthorizableUpgradeable.sol";

/// @notice A mock powerful condition to expose internal functions
/// @dev DO NOT USE IN PRODUCTION!
contract RuledConditionMock is DaoAuthorizableUpgradeable, RuledCondition {
    function updateRules(Rule[] memory _rules) public virtual {
        _updateRules(_rules);
    }

    function isGranted(
        address _where,
        address _who,
        bytes32 _permissionId,
        bytes calldata
    ) external view override returns (bool isPermitted) {
        return _evalRule(0, _where, _who, _permissionId, new uint256[](0));
    }
}
