// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {Proposal} from "../../../../plugin/extensions/proposal/Proposal.sol";
import {IExecutor} from "../../../../executors/IExecutor.sol";

/// @notice A mock contract.
/// @dev DO NOT USE IN PRODUCTION!
contract ProposalMock is Proposal {
    // We don't need to test these below functions as they will be tested in the actual plugins.
    // This mock contract is only used to test `supportsInterface` function.

    // solhint-disable no-empty-blocks
    function createProposal(
        bytes memory data,
        IExecutor.Action[] memory actions,
        uint64 startDate,
        uint64 endDate,
        bytes memory
    ) external returns (uint256 proposalId) {}

    function canExecute(uint256 proposalId) external view returns (bool) {}

    function createProposalId(
        IExecutor.Action[] memory actions,
        bytes memory metadata
    ) external view returns (uint256) {}

    function createProposalParamsABI() external view returns (string memory) {}
}
