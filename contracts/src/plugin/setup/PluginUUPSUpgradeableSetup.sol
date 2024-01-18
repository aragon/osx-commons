// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IProtocolVersion} from "../../utils/versioning/IProtocolVersion.sol";
import {ProtocolVersion} from "../../utils/versioning/ProtocolVersion.sol";
import {IPluginSetup} from "./IPluginSetup.sol";

/// @title PluginUUPSUpgradeableSetup
/// @author Aragon Association - 2022-2023
/// @notice An abstract contract that developers have to inherit from to write the setup of a plugin.
/// @custom:security-contact sirt@aragon.org
abstract contract PluginUUPSUpgradeableSetup is ERC165, IPluginSetup, ProtocolVersion {
    /// @notice Thrown when an update is not available, for example, if this is the initial build.
    /// @param fromBuild The build number to update from.
    /// @param thisBuild The build number of this setup to update to.
    error InvalidUpdatePath(uint16 fromBuild, uint16 thisBuild);

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return
            _interfaceId == type(IPluginSetup).interfaceId ||
            _interfaceId == type(IProtocolVersion).interfaceId ||
            super.supportsInterface(_interfaceId);
    }
}
