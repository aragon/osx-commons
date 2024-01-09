// SPDX-License-Identifier: AGPL-3.0-or-later

/* solhint-disable one-contract-per-file */
pragma solidity ^0.8.8;

import {PluginUUPSUpgradeable} from "../../plugin/PluginUUPSUpgradeable.sol";
import {IDAO} from "../../dao/IDAO.sol";

contract PluginUUPSUpgradeableMockBuild1 is PluginUUPSUpgradeable {
    uint256 public state1;

    function initialize(IDAO _dao) external initializer {
        __PluginUUPSUpgradeable_init(_dao);
        state1 = 1;
    }
}

contract PluginUUPSUpgradeableMockBuild2 is PluginUUPSUpgradeable {
    uint256 public state1;
    uint256 public state2;

    function initialize(IDAO _dao) external reinitializer(2) {
        __PluginUUPSUpgradeable_init(_dao);
        state1 = 1;
        state2 = 2;
    }

    function initializeFrom(uint16 _previousBuild) external reinitializer(2) {
        if (_previousBuild < 2) {
            state2 = 2;
        }
    }
}

contract PluginUUPSUpgradeableMockBuild3 is PluginUUPSUpgradeable {
    uint256 public state1;
    uint256 public state2;
    uint256 public state3;

    function initialize(IDAO _dao) external reinitializer(3) {
        __PluginUUPSUpgradeable_init(_dao);
        state1 = 1;
        state2 = 2;
        state3 = 3;
    }

    function initializeFrom(uint16 _previousBuild) external reinitializer(3) {
        if (_previousBuild < 2) {
            state2 = 2;
        }
        if (_previousBuild < 3) {
            state2 = 3;
        }
    }
}
