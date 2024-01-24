// SPDX-License-Identifier: AGPL-3.0-or-later

/* solhint-disable one-contract-per-file */
pragma solidity ^0.8.8;

import {PermissionLib} from "../../permission/PermissionLib.sol";
import {IPluginSetup} from "../../plugin/setup/IPluginSetup.sol";
import {PluginSetup} from "../../plugin/setup/PluginSetup.sol";
import {IDAO} from "../../dao/IDAO.sol";
import {mockPermissions, mockHelpers} from "./PluginSetupMockData.sol";
import {PluginCloneableMockBuild1, PluginCloneableMockBuild2} from "./PluginCloneableMock.sol";

/// @notice A mock plugin setup of a cloneable plugin to be deployed via the minimal proxy pattern.
/// v1.1 (Release 1, Build 1)
/// @dev DO NOT USE IN PRODUCTION!
contract PluginCloneableSetupMockBuild1 is PluginSetup {
    address internal pluginBase;

    constructor() {
        pluginBase = address(new PluginCloneableMockBuild1());
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes memory
    ) external override returns (address plugin, PreparedSetupData memory preparedSetupData) {
        bytes memory initData = abi.encodeCall(PluginCloneableMockBuild1.initialize, (IDAO(_dao)));
        plugin = createERC1967Proxy(pluginBase, initData); // TODO createClone(pluginBase, initData); is missing! See task OS-794 and OS-675.
        preparedSetupData.helpers = mockHelpers(1);
        preparedSetupData.permissions = mockPermissions(0, 1, PermissionLib.Operation.Grant);
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    ) external pure override returns (PermissionLib.MultiTargetPermission[] memory permissions) {
        (_dao, _payload);
        permissions = mockPermissions(0, 1, PermissionLib.Operation.Revoke);
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view override returns (address) {
        return address(pluginBase);
    }
}

/// @notice A mock plugin setup of a cloneable plugin to be deployed via the minimal proxy pattern.
/// v1.2 (Release 1, Build 2)
/// @dev DO NOT USE IN PRODUCTION!
contract PluginCloneableSetupMockBuild2 is PluginSetup {
    address internal pluginBase;

    constructor() {
        pluginBase = address(new PluginCloneableMockBuild2());
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes memory
    ) external override returns (address plugin, PreparedSetupData memory preparedSetupData) {
        bytes memory initData = abi.encodeCall(PluginCloneableMockBuild2.initialize, (IDAO(_dao)));
        plugin = createERC1967Proxy(pluginBase, initData); // TODO createClone(pluginBase, initData); is missing! See task OS-794 and OS-675.
        preparedSetupData.helpers = mockHelpers(2);
        preparedSetupData.permissions = mockPermissions(0, 2, PermissionLib.Operation.Grant);
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    ) external pure override returns (PermissionLib.MultiTargetPermission[] memory permissions) {
        (_dao, _payload);
        permissions = mockPermissions(0, 2, PermissionLib.Operation.Revoke);
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view override returns (address) {
        return address(pluginBase);
    }
}
