// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {PluginCloneable} from "../../../plugin/PluginCloneable.sol";
import {IDAO} from "../../../dao/IDAO.sol";

contract PluginCloneableMockBuild1 is PluginCloneable {
    uint256 public state1;

    function initialize(IDAO _dao) external initializer {
        __PluginCloneable_init(_dao);
        state1 = 1;
    }
}
