// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {IDAO} from "../../../dao/IDAO.sol";

/// @title IProposal
/// @author Aragon X - 2022-2023
/// @notice An interface to be implemented by DAO plugins that create and execute proposals.
/// @custom:security-contact sirt@aragon.org
interface IProposal {
    /// @notice Emitted when a proposal is created.
    /// @param proposalId The ID of the proposal.
    /// @param creator  The creator of the proposal.
    /// @param startDate The start date of the proposal in seconds.
    /// @param endDate The end date of the proposal in seconds.
    /// @param metadata The metadata of the proposal.
    /// @param actions The actions that will be executed if the proposal passes.
    /// @param allowFailureMap A bitmap allowing the proposal to succeed, even if individual actions might revert. If the bit at index `i` is 1, the proposal succeeds even if the `i`th action reverts. A failure map value of 0 requires every action to not revert.
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed creator,
        uint64 startDate,
        uint64 endDate,
        bytes metadata,
        IDAO.Action[] actions,
        uint256 allowFailureMap
    );

    /// @notice Emitted when a proposal is executed.
    /// @param proposalId The ID of the proposal.
    event ProposalExecuted(uint256 indexed proposalId);

    /// @notice Creates a new proposal.
    /// @param data The metadata of the proposal.
    /// @param actions The actions that will be executed after the proposal passes.
    /// @param startDate The start date of the proposal.
    /// @param endDate The end date of the proposal.
    /// @return proposalId The id of the proposal.
    function createProposal(
        bytes memory data,
        IDAO.Action[] memory actions,
        uint64 startDate,
        uint64 endDate
    ) external returns (uint256 proposalId);

    /// @notice Whether proposal can be executed or not.
    /// @param proposalId The id of the proposal.
    /// @return bool Returns if proposal can be executed or not.
    function canExecute(uint256 proposalId) external view returns (bool);

    /// @notice Creates a proposal Id.
    /// @param actions The actions that will be executed after the proposal passes.
    /// @param metadata The custom metadata that is passed when creating a proposal.
    /// @return proposalId The id of the proposal.
    function createProposalId(
        IDAO.Action[] memory actions,
        bytes memory metadata
    ) external view returns (uint256);

    /// @notice Returns the proposal count determining the next proposal ID.
    /// @dev This function has been deprecated but due to backwards compatibility, it still stays in the interface
    /// but returns maximum value of uint256 to let consumers know not to depend on it anymore.
    /// @return The proposal count.
    function proposalCount() external view returns (uint256);
}
