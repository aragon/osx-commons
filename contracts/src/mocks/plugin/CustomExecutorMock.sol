// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {IDAO} from "../../dao/IDAO.sol";

/// @notice A mock DAO that anyone can set permissions in.
/// @dev DO NOT USE IN PRODUCTION!
contract CustomExecutorMock {
    error Failed();

    event Executed(
        address indexed actor,
        bytes32 callId,
        IDAO.Action[] actions,
        uint256 allowFailureMap,
        uint256 failureMap,
        bytes[] execResults
    );

    function execute(
        bytes32 callId,
        IDAO.Action[] memory _actions,
        uint256 allowFailureMap
    ) external returns (bytes[] memory execResults, uint256 failureMap) {
        if (callId == bytes32(0)) {
            revert Failed();
        } else {
            emit Executed(msg.sender, callId, _actions, allowFailureMap, failureMap, execResults);
        }
    }
}
