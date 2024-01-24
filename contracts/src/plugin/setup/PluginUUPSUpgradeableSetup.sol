// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IProtocolVersion} from "../../utils/versioning/IProtocolVersion.sol";
import {ProtocolVersion} from "../../utils/versioning/ProtocolVersion.sol";
import {IPluginSetup} from "./IPluginSetup.sol";

/// @title PluginUUPSUpgradeableSetup
/// @author Aragon Association - 2022-2023
/// @notice An abstract contract to inherit from to implement the plugin setup for `PluginUUPSUpgradeable` plugins being deployed via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)).
/// @custom:security-contact sirt@aragon.org
abstract contract PluginUUPSUpgradeableSetup is ERC165, IPluginSetup, ProtocolVersion {
    /// @notice The address of the plugin implementation contract for initial block explorer verification
    /// and to create [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) UUPS proxies from.
    address internal immutable IMPLEMENTATION_;

    /// @notice Thrown when an update is not available, for example, if this is the initial build.
    /// @param fromBuild The build number to update from.
    /// @param thisBuild The build number of this setup to update to.
    error InvalidUpdatePath(uint16 fromBuild, uint16 thisBuild);

    /// @notice The contract constructor, that setting the plugin implementation contract.
    /// @param _implementation The address of the plugin implementation contract.
    constructor(address _implementation) {
        IMPLEMENTATION_ = _implementation;
    }

    /// @inheritdoc IPluginSetup
    /// @dev A virtual function being already implemented for the initial build 1.
    /// It should be overriden in subsequent builds to support updates from previous builds.
    function prepareUpdate(
        address _dao,
        uint16 _fromBuild,
        SetupPayload calldata _payload
    ) external pure virtual returns (bytes memory, PreparedSetupData memory) {
        (_dao, _fromBuild, _payload);
        revert InvalidUpdatePath({fromBuild: 0, thisBuild: 1});
    }

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return
            _interfaceId == type(IPluginSetup).interfaceId ||
            _interfaceId == type(IProtocolVersion).interfaceId ||
            super.supportsInterface(_interfaceId);
    }

    /// @inheritdoc IPluginSetup
    function implementation() public view returns (address) {
        return IMPLEMENTATION_;
    }
}
