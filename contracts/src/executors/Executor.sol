// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {IExecutor, Action} from "./IExecutor.sol";
import {flipBit, hasBit} from "../utils/math/BitMap.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

/// @notice Simple Executor that loops through the actions and executes them.
/// @dev This doesn't use any type of permission for execution and can be called by anyone.
/// Most useful use-case is to deploy as non-upgradeable and call from another contract via delegatecall.
/// If used with delegatecall, DO NOT add state variables in sequential slots, otherwise this will overwrite
/// the storage of the calling contract.
contract Executor is IExecutor, ERC165 {
    /// @notice The internal constant storing the maximal action array length.
    uint256 internal constant MAX_ACTIONS = 256;

    // keccak256("osx-commons.storage.Executor")
    // solhint-disable-next-line const-name-snakecase
    bytes32 private constant ReentrancyGuardStorageLocation =
        0x4d6542319dfb3f7c8adbb488d7b4d7cf849381f14faf4b64de3ac05d08c0bdec;

    /// @notice The first out of two values to which the `_reentrancyStatus` state variable (used by the `nonReentrant` modifier) can be set indicating that a function was not entered.
    uint256 private constant _NOT_ENTERED = 1;

    /// @notice The second out of two values to which the `_reentrancyStatus` state variable (used by the `nonReentrant` modifier) can be set indicating that a function was entered.
    uint256 private constant _ENTERED = 2;

    /// @notice Thrown if the action array length is larger than `MAX_ACTIONS`.
    error TooManyActions();

    /// @notice Thrown if an action has insufficient gas left.
    error InsufficientGas();

    /// @notice Thrown if action execution has failed.
    /// @param index The index of the action in the action array that failed.
    error ActionFailed(uint256 index);

    /// @notice Thrown if a call is reentrant.
    error ReentrantCall();

    constructor() {
        _storeReentrancyStatus(_NOT_ENTERED);
    }

    modifier nonReentrant() {
        if (_getReentrancyStatus() == _ENTERED) {
            revert ReentrantCall();
        }

        _storeReentrancyStatus(_ENTERED);

        _;

        _storeReentrancyStatus(_NOT_ENTERED);
    }

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return _interfaceId == type(IExecutor).interfaceId || super.supportsInterface(_interfaceId);
    }

    /// @inheritdoc IExecutor
    function execute(
        bytes32 _callId,
        Action[] memory _actions,
        uint256 _allowFailureMap
    )
        public
        virtual
        override
        nonReentrant
        returns (bytes[] memory execResults, uint256 failureMap)
    {
        // Check that the action array length is within bounds.
        if (_actions.length > MAX_ACTIONS) {
            revert TooManyActions();
        }

        execResults = new bytes[](_actions.length);

        uint256 gasBefore;
        uint256 gasAfter;

        for (uint256 i = 0; i < _actions.length; ) {
            gasBefore = gasleft();

            (bool success, bytes memory data) = _actions[i].to.call{value: _actions[i].value}(
                _actions[i].data
            );

            gasAfter = gasleft();

            // Check if failure is allowed
            if (!success) {
                if (!hasBit(_allowFailureMap, uint8(i))) {
                    revert ActionFailed(i);
                }

                // Make sure that the action call did not fail because 63/64 of `gasleft()` was insufficient to execute the external call `.to.call` (see [ERC-150](https://eips.ethereum.org/EIPS/eip-150)).
                // In specific scenarios, i.e. proposal execution where the last action in the action array is allowed to fail, the account calling `execute` could force-fail this action by setting a gas limit
                // where 63/64 is insufficient causing the `.to.call` to fail, but where the remaining 1/64 gas are sufficient to successfully finish the `execute` call.
                if (gasAfter < gasBefore / 64) {
                    revert InsufficientGas();
                }
                // Store that this action failed.
                failureMap = flipBit(failureMap, uint8(i));
            }

            execResults[i] = data;

            unchecked {
                ++i;
            }
        }

        emit Executed({
            actor: msg.sender,
            callId: _callId,
            actions: _actions,
            allowFailureMap: _allowFailureMap,
            failureMap: failureMap,
            execResults: execResults
        });
    }

    /// @notice Gets the current reentrancy status.
    /// @return status This returns the current reentrancy status.
    function _getReentrancyStatus() private view returns (uint256 status) {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            status := sload(ReentrancyGuardStorageLocation)
        }
    }

    /// @notice Stores the reentrancy status on a specific slot.
    function _storeReentrancyStatus(uint256 _status) private {
        // solhint-disable-next-line no-inline-assembly
        assembly {
            sstore(ReentrancyGuardStorageLocation, _status)
        }
    }
}
