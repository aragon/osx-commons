// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC165Upgradeable} from "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";

import {DaoAuthorizableUpgradeable} from "../../../permission/auth/DaoAuthorizableUpgradeable.sol";

/// @title MetadataContract
/// @dev Due to the requirements that already existing upgradeable plugins need to start inheritting from this,
///  we're required to use hardcoded/specific slots for storage instead of sequential slots with gaps.
/// @author Aragon X - 2024
/// @custom:security-contact sirt@aragon.org
abstract contract MetadataContractUpgradeable is ERC165Upgradeable, DaoAuthorizableUpgradeable {
    /// @notice The ID of the permission required to call the `updateMetadata` function.
    bytes32 public constant UPDATE_METADATA_PERMISSION_ID = keccak256("UPDATE_METADATA_PERMISSION");

    // keccak256("osx-commons.storage.MetadataContractUpgradeable")
    bytes32 private constant MetadataStorageLocation =
        0x99da6c69991bd6a0d70d0c3817ab9bd9d4d7e3090d51c182be2cf851bfab8d70;

    /// @notice Emitted when metadata is updated.
    event MetadataUpdated(bytes metadata);

    /// @notice Thrown if metadata is set empty.
    error EmptyMetadata();

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
        return _getMetadata();
    }

    /// @notice Internal function to update metadata.
    /// @param _metadata The utf8 bytes of a content addressing cid that stores contract's information.
    function _updateMetadata(bytes memory _metadata) internal virtual {
        if (_metadata.length == 0) {
            revert EmptyMetadata();
        }

        _storeMetadata(_metadata);
        emit MetadataUpdated(_metadata);
    }

    /// @notice Gets the currently set metadata.
    /// @return _metadata The current metadata.
    function _getMetadata() private view returns (bytes memory _metadata) {
        assembly {
            _metadata := sload(MetadataStorageLocation)
        }
    }

    /// @notice Stores the metadata on a specific slot.
    function _storeMetadata(bytes memory _metadata) private {
        assembly {
            sstore(MetadataStorageLocation, _metadata)
        }
    }
}
