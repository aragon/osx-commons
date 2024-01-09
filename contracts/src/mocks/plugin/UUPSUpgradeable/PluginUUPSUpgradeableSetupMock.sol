// SPDX-License-Identifier: AGPL-3.0-or-later

/* solhint-disable one-contract-per-file */
pragma solidity ^0.8.8;

import {PermissionLib} from "../../../permission/PermissionLib.sol";
import {IPluginSetup} from "../../../plugin/setup/IPluginSetup.sol";
import {PluginSetup} from "../../../plugin/setup/PluginSetup.sol";
import {IDAO} from "../../../dao/IDAO.sol";
import {mockPermissions, mockHelpers} from "../PluginSetupMockData.sol";
import {PluginUUPSUpgradeableMockBuild1, PluginUUPSUpgradeableMockBuild2, PluginUUPSUpgradeableMockBuild3} from "./PluginUUPSUpgradeableMock.sol";

contract PluginUUPSUpgradeableSetupMockBuild1 is PluginSetup {
    address internal pluginBase;

    constructor() {
        pluginBase = address(new PluginUUPSUpgradeableMockBuild1());
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes memory
    ) public virtual override returns (address plugin, PreparedSetupData memory preparedSetupData) {
        bytes memory initData = abi.encodeCall(
            PluginUUPSUpgradeableMockBuild1.initialize,
            (IDAO(_dao))
        );
        plugin = createERC1967Proxy(pluginBase, initData);
        preparedSetupData.helpers = mockHelpers(1);
        preparedSetupData.permissions = mockPermissions(0, 1, PermissionLib.Operation.Grant);
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    ) external virtual override returns (PermissionLib.MultiTargetPermission[] memory permissions) {
        (_dao, _payload);
        permissions = mockPermissions(0, 1, PermissionLib.Operation.Revoke);
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view virtual override returns (address) {
        return address(pluginBase);
    }
}

contract PluginUUPSUpgradeableSetupMockBuild2 is PluginSetup {
    address internal pluginBase;

    constructor() {
        pluginBase = address(new PluginUUPSUpgradeableMockBuild2());
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes memory
    ) external override returns (address plugin, PreparedSetupData memory preparedSetupData) {
        bytes memory initData = abi.encodeCall(
            PluginUUPSUpgradeableMockBuild2.initialize,
            (IDAO(_dao))
        );
        plugin = createERC1967Proxy(pluginBase, initData);
        preparedSetupData.helpers = mockHelpers(2);
        preparedSetupData.permissions = mockPermissions(0, 2, PermissionLib.Operation.Grant);
    }

    /// @inheritdoc IPluginSetup
    function prepareUpdate(
        address _dao,
        uint16 _currentBuild,
        SetupPayload calldata _payload
    )
        external
        pure
        override
        returns (bytes memory initData, PreparedSetupData memory preparedSetupData)
    {
        (_dao, _payload);

        // Update from Build 1
        if (_currentBuild == 1) {
            preparedSetupData.helpers = mockHelpers(2);
            initData = abi.encodeCall(
                PluginUUPSUpgradeableMockBuild2.initializeFrom,
                (_currentBuild)
            );
            preparedSetupData.permissions = mockPermissions(1, 2, PermissionLib.Operation.Grant);
        }
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

contract PluginUUPSUpgradeableSetupMockBuild3 is PluginSetup {
    address internal pluginBase;

    constructor() {
        pluginBase = address(new PluginUUPSUpgradeableMockBuild3());
    }

    /// @inheritdoc IPluginSetup
    function prepareInstallation(
        address _dao,
        bytes memory
    ) external returns (address plugin, PreparedSetupData memory preparedSetupData) {
        bytes memory initData = abi.encodeCall(
            PluginUUPSUpgradeableMockBuild3.initialize,
            (IDAO(_dao))
        );
        plugin = createERC1967Proxy(pluginBase, initData);
        preparedSetupData.helpers = mockHelpers(3);
        preparedSetupData.permissions = mockPermissions(0, 3, PermissionLib.Operation.Grant);
    }

    /// @inheritdoc IPluginSetup
    function prepareUpdate(
        address _dao,
        uint16 _currentBuild,
        SetupPayload calldata _payload
    )
        external
        pure
        override
        returns (bytes memory initData, PreparedSetupData memory preparedSetupData)
    {
        (_dao, _payload);

        // Update from Build 1
        if (_currentBuild == 1) {
            preparedSetupData.helpers = mockHelpers(3);
            initData = abi.encodeCall(
                PluginUUPSUpgradeableMockBuild3.initializeFrom,
                (_currentBuild)
            );
            preparedSetupData.permissions = mockPermissions(1, 3, PermissionLib.Operation.Grant);
        }

        // Update from Build 2
        if (_currentBuild == 2) {
            preparedSetupData.helpers = mockHelpers(3);
            initData = abi.encodeCall(
                PluginUUPSUpgradeableMockBuild3.initializeFrom,
                (_currentBuild)
            );
            preparedSetupData.permissions = mockPermissions(2, 3, PermissionLib.Operation.Grant);
        }
    }

    /// @inheritdoc IPluginSetup
    function prepareUninstallation(
        address _dao,
        SetupPayload calldata _payload
    ) external virtual override returns (PermissionLib.MultiTargetPermission[] memory permissions) {
        (_dao, _payload);
        permissions = mockPermissions(0, 3, PermissionLib.Operation.Revoke);
    }

    /// @inheritdoc IPluginSetup
    function implementation() external view override returns (address) {
        return address(pluginBase);
    }
}
