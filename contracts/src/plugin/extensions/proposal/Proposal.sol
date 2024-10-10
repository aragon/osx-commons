// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IProposal} from "./IProposal.sol";

/// @title Proposal
/// @author Aragon X - 2022-2023
/// @notice An abstract contract containing the traits and internal functionality to create and execute proposals that can be inherited by non-upgradeable DAO plugins.
/// @custom:security-contact sirt@aragon.org
abstract contract Proposal is IProposal, ERC165 {
    /// @inheritdoc IProposal
    function proposalCount() public pure override returns (uint256) {
        return type(uint256).max;
    }

    /// @notice Creates a proposal Id.
    /// @dev Uses timestamp and chain id to ensure more probability of uniqueness.
    /// @param salt The extra salt to help with uniqueness.
    /// @return The id of the proposal.
    function _createProposalId(bytes32 salt) internal view virtual returns (uint256) {
        return uint256(keccak256(abi.encode(block.chainid, block.timestamp, address(this), salt)));
    }

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        // In addition to the current interfaceId, also support previous version of the interfaceId
        // that did not include the following functions:
        // `createProposal, canExecute, createProposalParamsABI`.
        return
            _interfaceId ==
            type(IProposal).interfaceId ^
                IProposal.createProposal.selector ^
                IProposal.canExecute.selector ^
                IProposal.createProposalParamsABI.selector ||
            _interfaceId == type(IProposal).interfaceId ||
            super.supportsInterface(_interfaceId);
    }
}
