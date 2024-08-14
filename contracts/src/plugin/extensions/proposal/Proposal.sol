// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {Counters} from "@openzeppelin/contracts/utils/Counters.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IDAO} from "../../../dao/IDAO.sol";
import {IProposal} from "./IProposal.sol";

/// @title Proposal
/// @author Aragon X - 2022-2023
/// @notice An abstract contract containing the traits and internal functionality to create and execute proposals that can be inherited by non-upgradeable DAO plugins.
/// @custom:security-contact sirt@aragon.org
abstract contract Proposal is IProposal, ERC165 {
    using Counters for Counters.Counter;

    /// @notice The incremental ID for proposals and executions.
    Counters.Counter private proposalCounter;

    /// Shall we remove this ? Does anyone use this ? if we keep having this,
    // this will not return the correct value anyways anymore.
    /// @inheritdoc IProposal
    function proposalCount() public view override returns (uint256) {
        return 0;
    }

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        // In addition to the current interfaceId, also support previous version of the interfaceId that did not
        // include the createProposal() function as standard
        return
            _interfaceId ==
            type(IProposal).interfaceId ^
                IProposal.createProposal.selector ^
                IProposal.canExecute.selector ||
            _interfaceId == type(IProposal).interfaceId ||
            super.supportsInterface(_interfaceId);
    }
}
