// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

/// @title ERC1967ProxyFactory
/// @author Aragon Association - 2023
/// @notice A factory to deploy proxies via the UUPS pattern (see [ERC-1822](https://eips.ethereum.org/EIPS/eip-1822)).
/// @custom:security-contact sirt@aragon.org
contract UUPSProxyFactory {
    /// @notice The immutable logic contract address.
    address private immutable _LOGIC;

    /// @notice Emitted when an [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) contract is created.
    /// @param proxy The proxy address.
    event UUPSProxyCreated(address proxy);

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
        proxy = address(new ERC1967Proxy(_LOGIC, _data));
        emit UUPSProxyCreated({proxy: proxy});
    }
}
