// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

// solhint-disable-next-line no-unused-import
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

import {IProtocolVersion} from "../../utils/versioning/IProtocolVersion.sol";
import {ProtocolVersion} from "../../utils/versioning/ProtocolVersion.sol";
import {createERC1967Proxy as createERC1967} from "../../utils/deployment/Proxy.sol";
import {IPluginSetup} from "./IPluginSetup.sol";

/// @title PluginSetup
/// @author Aragon Association - 2022-2023
/// @notice An abstract contract that developers have to inherit from to write the setup of a plugin.
/// @custom:security-contact sirt@aragon.org
abstract contract PluginSetup is ERC165, IPluginSetup, ProtocolVersion {
    /// @inheritdoc IPluginSetup
    function prepareUpdate(
        address _dao,
        uint16 _currentBuild,
        SetupPayload calldata _payload
    )
        external
        virtual
        override
        returns (bytes memory initData, PreparedSetupData memory preparedSetupData)
    // solhint-disable-next-line no-empty-blocks
    {
        // Empty to have a default implementation for non-upgradeable plugins.
        // TODO Revert with custom error.
    }

    /// @notice A convenience function to create an [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) proxy contract pointing to an implementation and being associated to a DAO.
    /// @param _implementation The address of the implementation contract to which the proxy is pointing to.
    /// @param _data The data to initialize the storage of the proxy contract.
    /// @return The address of the created proxy contract.
    function createERC1967Proxy(
        address _implementation,
        bytes memory _data
    ) internal returns (address) {
        return createERC1967(_implementation, _data);
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
}