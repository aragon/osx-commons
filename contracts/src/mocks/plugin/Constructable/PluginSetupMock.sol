// SPDX-License-Identifier: AGPL-3.0-or-later

/* solhint-disable one-contract-per-file */
pragma solidity ^0.8.8;

import {PermissionLib} from "../../../permission/PermissionLib.sol";
import {IPluginSetup} from "../../../plugin/setup/IPluginSetup.sol";
import {PluginSetup} from "../../../plugin/setup/PluginSetup.sol";
import {mockPermissions, mockHelpers} from "../PluginSetupMockData.sol";
import {IDAO} from "../../../dao/IDAO.sol";
import {PluginMockBuild1} from "./PluginMock.sol";

contract PluginSetupMockBuild1 is PluginSetup {
    address internal pluginBase;

    constructor() {
        pluginBase = address(new PluginMockBuild1(IDAO(address(0))));
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes memory
    ) external override returns (address plugin, PreparedSetupData memory preparedSetupData) {
        plugin = address(new PluginMockBuild1(IDAO(_dao)));
        preparedSetupData.helpers = mockHelpers(1);
        preparedSetupData.permissions = mockPermissions(5, 6, PermissionLib.Operation.Grant);
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    ) external pure override returns (PermissionLib.MultiTargetPermission[] memory permissions) {
        (_dao, _payload);
        permissions = mockPermissions(5, 6, PermissionLib.Operation.Revoke);
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view override returns (address) {
        return address(pluginBase);
    }
}
