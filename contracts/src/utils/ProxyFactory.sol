// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ProxyLib} from "./ProxyLib.sol";

/// @title ProxyFactory
/// @author Aragon Association - 2023
/// @notice A factory to deploy proxies via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)) and minimal proxy pattern (see [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167)).
/// @custom:security-contact sirt@aragon.org
contract ProxyFactory {
    using ProxyLib for address;
    /// @notice The immutable logic contract address.
    address private immutable _LOGIC;

    /// @notice Emitted when an proxy contract is created.
    /// @param proxy The proxy address.
    event ProxyCreated(address proxy);

    /// @notice Initializes the contract with a logic contract address.
    /// @param _logic The logic contract address.
    constructor(address _logic) {
        _LOGIC = _logic;
    }

    /// @notice Creates an [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) proxy contract pointing to the pre-set logic contract.
    /// @param _data The initialization data for this contract.
    /// @return proxy The address of the proxy contract created.
    /// @dev If `_data` is non-empty, it is used in a delegate call to the `_logic` contract. This will typically be an encoded function call initializing the storage of the proxy (see [OpenZeppelin ERC1967Proxy-constructor](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Proxy-constructor-address-bytes-)).
    function deployUUPSProxy(bytes memory _data) external returns (address proxy) {
        proxy = _LOGIC.deployUUPSProxy(_data);
        emit ProxyCreated({proxy: proxy});
    }

    /// @notice Creates an [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167) minimal proxy contract pointing to the pre-set logic contract.
    /// @param _data The initialization data for this contract.
    /// @return proxy The address of the proxy contract created.
    /// @dev If `_data` is non-empty, it is used in a call to the clone contract. This will typically be an encoded function call initializing the storage of the contract.
    function deployMinimalProxy(bytes memory _data) external returns (address proxy) {
        proxy = _LOGIC.deployMinimalProxy(_data);
        emit ProxyCreated({proxy: proxy});
    }
}
