// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ProposalUpgradeable} from "../../../../plugin/extensions/proposal/ProposalUpgradeable.sol";
import {IExecutor, Action} from "../../../../executors/IExecutor.sol";

/// @notice A mock contract.
/// @dev DO NOT USE IN PRODUCTION!
contract ProposalUpgradeableMock is ProposalUpgradeable {
    // We don't need to test these below functions as they will be tested in the actual plugins.
    // This mock contract is only used to test `supportsInterface` function.

    // solhint-disable no-empty-blocks
    function createProposal(
        bytes memory data,
        Action[] memory actions,
        uint64 startDate,
        uint64 endDate,
        bytes memory
    ) external returns (uint256 proposalId) {}

    function canExecute(uint256 proposalId) external view returns (bool) {}

    function customProposalParamsABI() external view returns (string memory) {}
}
