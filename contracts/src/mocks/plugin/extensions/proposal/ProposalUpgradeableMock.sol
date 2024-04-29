// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ProposalUpgradeable} from "../../../../plugin/extensions/proposal/ProposalUpgradeable.sol";
import {IDAO} from "../../../../dao/IDAO.sol";

/// @notice A mock contract containing functions to create and execute proposals as well as storage gaps in inherited contracts to be used in UUPS upgradeable contracts.
/// @dev DO NOT USE IN PRODUCTION!
contract ProposalUpgradeableMock is ProposalUpgradeable {
    function createProposalId() external returns (uint256 proposalId) {
        proposalId = _createProposalId();
    }

    function createProposal(
        address _creator,
        bytes calldata _metadata,
        uint64 _startDate,
        uint64 _endDate,
        IDAO.Action[] calldata _actions,
        uint256 _allowFailureMap
    ) external returns (uint256 proposalId) {
        proposalId = _createProposal(
            _creator,
            _metadata,
            _startDate,
            _endDate,
            _actions,
            _allowFailureMap
        );
    }

    function executeProposal(
        IDAO _dao,
        uint256 _proposalId,
        IDAO.Action[] memory _actions,
        uint256 _allowFailureMap
    ) external returns (bytes[] memory execResults, uint256 failureMap) {
        (execResults, failureMap) = _executeProposal(_dao, _proposalId, _actions, _allowFailureMap);
    }
}
