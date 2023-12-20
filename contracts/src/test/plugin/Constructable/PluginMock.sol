// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {Plugin} from "../../../plugin/Plugin.sol";
import {IDAO} from "../../../interfaces/IDAO.sol";

contract PluginV1Mock is Plugin {
    uint256 public state1;

    constructor(IDAO _dao) Plugin(_dao) {
        state1 = 1;
    }
}
