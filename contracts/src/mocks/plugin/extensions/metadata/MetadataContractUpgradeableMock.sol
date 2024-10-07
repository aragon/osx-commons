// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {MetadataContractUpgradeable} from "../../../../plugin/extensions/metadata/MetadataContractUpgradeable.sol";
import {IDAO} from "../../../../dao/IDAO.sol";

/// @notice A mock contract.
/// @dev DO NOT USE IN PRODUCTION!
contract MetadataContractUpgradeableMock is MetadataContractUpgradeable {
    function initialize(IDAO _dao) public {
        __DaoAuthorizableUpgradeable_init(_dao);
    }
}
