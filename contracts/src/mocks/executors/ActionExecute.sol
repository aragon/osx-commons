// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {IExecutor, Action} from "../../executors/Executor.sol";
import "hardhat/console.sol";

/// @notice A dummy contract to test if Executor can successfully execute an action.
contract ActionExecute {
    uint num = 10;

    function setTest(uint newNum) public returns (uint) {
        num = newNum;
        return num;
    }

    function fail() public pure {
        revert("ActionExecute:Revert");
    }

    // Used to test custom reentrancy guard
    // that is implemented on Executor contract's
    // execute function.
    function callBackCaller() public {
        IExecutor(msg.sender).execute(bytes32(0), new Action[](0), 0);
    }
}
