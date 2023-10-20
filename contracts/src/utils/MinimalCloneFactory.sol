// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

/// @title CloneFactory
/// @author Aragon Association - 2023
/// @notice A factory to deploy clones via the minimal clones pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)).
/// @custom:security-contact sirt@aragon.org
contract MinimalCloneFactory {
    using Clones for address;

    /// @notice The immutable logic contract address.
    address private immutable _LOGIC;

    /// @notice Emitted when an [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167) contract is created.
    /// @param clone The clone address.
    event MinimalCloneCreated(address clone);

    /// @notice Initializes the contract with a logic contract address.
    /// @param _logic The logic contract address.
    constructor(address _logic) {
        _LOGIC = _logic;
    }

    /// @notice Creates an [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167) minimal clone contract pointing to the pre-set logic contract.
    /// @param _data The initialization data for this contract.
    /// @return clone The address of the clone created.
    /// @dev If `_data` is non-empty, it is used in a call to the clone contract. This will typically be an encoded function call initializing the storage of the contract.
    function deployClone(bytes memory _data) external returns (address clone) {
        clone = _LOGIC.clone();
        if (_data.length > 0) {
            Address.functionCall(clone, _data);
        }
    }
}
