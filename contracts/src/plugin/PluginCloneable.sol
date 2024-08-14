// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import {IProtocolVersion} from "../utils/versioning/IProtocolVersion.sol";
import {ProtocolVersion} from "../utils/versioning/ProtocolVersion.sol";
import {DaoAuthorizableUpgradeable} from "../permission/auth/DaoAuthorizableUpgradeable.sol";
import {IDAO} from "../dao/IDAO.sol";
import {IPlugin} from "./IPlugin.sol";

/// @title PluginCloneable
/// @author Aragon X - 2022-2023
/// @notice An abstract, non-upgradeable contract to inherit from when creating a plugin being deployed via the minimal clones pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)).
/// @custom:security-contact sirt@aragon.org
abstract contract PluginCloneable is
    IPlugin,
    ERC165Upgradeable,
    DaoAuthorizableUpgradeable,
    ProtocolVersion
{
    address private target;

    /// @dev Emitted each time the Target is set.
    event TargetSet(address indexed previousTarget, address indexed newTarget);

    /// @notice The ID of the permission required to call the `setTarget` function.
    bytes32 public constant SET_TARGET_PERMISSION_ID = keccak256("SET_TARGET_PERMISSION");

    /// @notice Disables the initializers on the implementation contract to prevent it from being left uninitialized.
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @notice Initializes the plugin by storing the associated DAO.
    /// @param _dao The DAO contract.
    // solhint-disable-next-line func-name-mixedcase
    function __PluginCloneable_init(IDAO _dao) internal virtual onlyInitializing {
        __DaoAuthorizableUpgradeable_init(_dao);
    }

    /// @dev Sets the target to a new target (`newTarget`).
    /// @param _target The target contract.
    function setTarget(address _target) public auth(SET_TARGET_PERMISSION_ID) {
        _setTarget(_target);
    }

    /// @inheritdoc IPlugin
    function pluginType() public pure override returns (PluginType) {
        return PluginType.Cloneable;
    }

    /// @notice Returns the currently set target contract.
    function getTarget() public view returns (address) {
        return target;
    }

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return
            _interfaceId == type(IPlugin).interfaceId ||
            _interfaceId == type(IProtocolVersion).interfaceId ||
            _interfaceId == this.setTarget.selector ^ this.getTarget.selector ||
            super.supportsInterface(_interfaceId);
    }

    /// @notice Sets the target to a new target (`newTarget`).
    /// @param _target The target contract.
    function _setTarget(address _target) internal virtual {
        address previousTarget = target;
        target = _target;
        emit TargetSet(previousTarget, _target);
    }

    /// @notice Forwards the actions to the currently set `target` for the execution.
    /// @param _callId Identifier for this execution.
    /// @param _actions actions that will be eventually called.
    /// @param _allowFailureMap Bitmap-encoded number. TODO:
    /// @return execResults address of the implementation contract.
    /// @return failureMap address of the implementation contract.
    function _execute(
        bytes32 _callId,
        IDAO.Action[] memory _actions,
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
        IDAO.Action[] memory _actions,
        uint256 _allowFailureMap
    ) internal virtual returns (bytes[] memory execResults, uint256 failureMap) {
        (execResults, failureMap) = IDAO(_target).execute(_callId, _actions, _allowFailureMap);
    }
}
