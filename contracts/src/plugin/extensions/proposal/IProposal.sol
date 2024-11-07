// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {Action} from "../../../executors/IExecutor.sol";

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
        Action[] actions,
        uint256 allowFailureMap
    );

    /// @notice Emitted when a proposal is executed.
    /// @param proposalId The ID of the proposal.
    event ProposalExecuted(uint256 indexed proposalId);

    /// @notice Creates a new proposal.
    /// @param metadata The metadata of the proposal.
    /// @param actions The actions that will be executed after the proposal passes.
    /// @param startDate The start date of the proposal.
    /// @param endDate The end date of the proposal.
    /// @param data The additional abi-encoded data to include more necessary fields.
    /// @return proposalId The id of the proposal.
    function createProposal(
        bytes memory metadata,
        Action[] memory actions,
        uint64 startDate,
        uint64 endDate,
        bytes memory data
    ) external returns (uint256 proposalId);

    /// @notice Whether proposal succeeded or not.
    /// @dev Note that this must not include time window checks and only make a decision based on the thresholds.
    /// @param proposalId The id of the proposal.
    /// @return bool Returns if proposal has been succeeded or not without including time window checks.
    function hasSucceeded(uint256 proposalId) external view returns (bool);

    /// @notice Executes a proposal.
    /// @param proposalId The ID of the proposal to be executed.
    function execute(uint256 proposalId) external;

    /// @notice The human-readable abi format for extra params included in `data` of `createProposal`.
    /// @dev Used for UI to easily detect what extra params the contract expects.
    /// @return abi ABI of params in `data` of `createProposal`.
    function customProposalParamsABI() external view returns (string memory abi);

    /// @notice Returns the proposal count determining the next proposal ID.
    /// @dev This function has been deprecated but due to backwards compatibility, it still exists
    /// in the interface but reverts to avoid ambiguity.
    /// @return The proposal count.
    function proposalCount() external view returns (uint256);
}
