// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {DaoAuthorizable} from "../../permission/auth/DaoAuthorizable.sol";

/// @title MetadataExtension
/// @author Aragon X - 2024
/// @custom:security-contact sirt@aragon.org
abstract contract MetadataExtension is ERC165, DaoAuthorizable {
    /// @notice The ID of the permission required to call the `updateMetadata` function.
    bytes32 public constant UPDATE_METADATA_PERMISSION_ID = keccak256("UPDATE_METADATA_PERMISSION");

    /// @notice Emitted when metadata is updated.
    event MetadataUpdated(bytes metadata);

    bytes private metadata;

    /// @notice Checks if this or the parent contract supports an interface by its ID.
    /// @param _interfaceId The ID of the interface.
    /// @return Returns `true` if the interface is supported.
    function supportsInterface(bytes4 _interfaceId) public view virtual override returns (bool) {
        return
            _interfaceId == this.updateMetadata.selector ^ this.getMetadata.selector ||
            super.supportsInterface(_interfaceId);
    }

    /// @notice Allows to update only the metadata.
    /// @param _metadata The utf8 bytes of a content addressing cid that stores plugin's information.
    function updateMetadata(
        bytes memory _metadata
    ) public virtual auth(UPDATE_METADATA_PERMISSION_ID) {
        _updateMetadata(_metadata);
    }

    /// @notice Returns the metadata currently applied.
    /// @return The The utf8 bytes of a content addressing cid.
    function getMetadata() public view returns (bytes memory) {
        return metadata;
    }

    /// @notice Internal function to update metadata.
    /// @param _metadata The utf8 bytes of a content addressing cid that stores contract's information.
    function _updateMetadata(bytes memory _metadata) internal virtual {
        metadata = _metadata;
        emit MetadataUpdated(_metadata);
    }
}
