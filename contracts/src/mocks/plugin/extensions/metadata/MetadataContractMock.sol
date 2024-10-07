// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {MetadataContract} from "../../../../plugin/extensions/metadata/MetadataContract.sol";
import {IDAO} from "../../../../dao/IDAO.sol";
import {DaoAuthorizable} from "../../../../permission/auth/DaoAuthorizable.sol";

/// @notice A mock contract.
/// @dev DO NOT USE IN PRODUCTION!
contract MetadataContractMock is MetadataContract {
    constructor(IDAO dao) DaoAuthorizable(dao) {}
}
