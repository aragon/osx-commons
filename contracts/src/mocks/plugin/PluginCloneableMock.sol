// SPDX-License-Identifier: AGPL-3.0-or-later

/* solhint-disable one-contract-per-file */
pragma solidity ^0.8.8;

import {PluginCloneable} from "../../plugin/PluginCloneable.sol";
import {IDAO} from "../../dao/IDAO.sol";

/// @notice A mock cloneable plugin to be deployed via the minimal proxy pattern.
/// v1.1 (Release 1, Build 1)
/// @dev DO NOT USE IN PRODUCTION!
contract PluginCloneableMockBuild1 is PluginCloneable {
    uint256 public state1;

    function initialize(IDAO _dao) external initializer {
        __PluginCloneable_init(_dao);
        state1 = 1;
    }
}

/// @notice A mock cloneable plugin to be deployed via the minimal proxy pattern.
/// v1.1 (Release 1, Build 2)
/// @dev DO NOT USE IN PRODUCTION!
contract PluginCloneableMockBuild2 is PluginCloneable {
    uint256 public state1;
    uint256 public state2;

    function initialize(IDAO _dao) external initializer {
        __PluginCloneable_init(_dao);
        state1 = 1;
        state2 = 2;
    }
}
