// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IProtocolVersion} from "../utils/versioning/IProtocolVersion.sol";
import {ProtocolVersion} from "../utils/versioning/ProtocolVersion.sol";
import {DaoAuthorizable} from "../permission/auth/DaoAuthorizable.sol";
import {IDAO} from "../dao/IDAO.sol";
import {IPlugin} from "./IPlugin.sol";

/// @title Plugin
/// @author Aragon X - 2022-2023
/// @notice An abstract, non-upgradeable contract to inherit from when creating a plugin being deployed via the `new` keyword.
/// @custom:security-contact sirt@aragon.org
abstract contract Plugin is IPlugin, ERC165, DaoAuthorizable, ProtocolVersion {
    address public target;

    /// @dev Emitted each time the Target is set.
    event TargetSet(address indexed previousTarget, address indexed newTarget);

    /// @notice Constructs the plugin by storing the associated DAO.
    /// @param _dao The DAO contract.
    constructor(IDAO _dao) DaoAuthorizable(_dao) {}

    /// @inheritdoc IPlugin
    function pluginType() public pure override returns (PluginType) {
        return PluginType.Constructable;
    }

    /// @dev Sets the target to a new target (`newTarget`).
    /// @notice Can only be called by the current owner. TODO
    function setTarget(address _target) public {
        address previousTarget = target;
        target = _target;
        emit TargetSet(previousTarget, _target);
    }

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return
            _interfaceId == type(IPlugin).interfaceId ||
            _interfaceId == type(IProtocolVersion).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

    /// @notice Forwards the actions to the currently set `target` for the execution.
    /// @param _callId Identifier for this execution.
    /// @param _actions actions that will be eventually called.
    /// @param _allowFailureMap Bitmap-encoded number. TODO:
    /// @return execResults address of the implementation contract.
    /// @return failureMap address of the implementation contract.
    function _execute(
        bytes32 _callId,
        IDAO.Action[] calldata _actions,
        uint256 _allowFailureMap
    ) internal virtual returns (bytes[] memory execResults, uint256 failureMap) {
        (execResults, failureMap) = IDAO(target).execute(_callId, _actions, _allowFailureMap);
    }

    /// @notice Forwards the actions to the `target` for the execution.
    /// @param _target Forwards the actions to the specific target.
    /// @param _callId Identifier for this execution.
    /// @param _actions actions that will be eventually called.
    /// @param _allowFailureMap Bitmap-encoded number. TODO:
    /// @return execResults address of the implementation contract.
    /// @return failureMap address of the implementation contract.
    function _execute(
        address _target,
        bytes32 _callId,
        IDAO.Action[] calldata _actions,
        uint256 _allowFailureMap
    ) internal virtual returns (bytes[] memory execResults, uint256 failureMap) {
        (execResults, failureMap) = IDAO(_target).execute(_callId, _actions, _allowFailureMap);
    }
}
