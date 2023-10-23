// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

library ProxyLib {
    using Clones for address;
    using Address for address;

    /// @notice Creates an [ERC-1967](https://eips.ethereum.org/EIPS/eip-1967) UUPS proxy contract pointing to a logic contract.
    /// @param _logic The logic contract the proxy is pointing to.
    /// @param _data The initialization data for this contract.
    /// @return uupsProxy The address of the UUPS proxy contract created.
    /// @dev If `_data` is non-empty, it is used in a delegate call to the `_logic` contract. This will typically be an encoded function call initializing the storage of the proxy (see [OpenZeppelin ERC1967Proxy-constructor](https://docs.openzeppelin.com/contracts/4.x/api/proxy#ERC1967Proxy-constructor-address-bytes-)).
    function deployUUPSProxy(
        address _logic,
        bytes memory _data
    ) internal returns (address uupsProxy) {
        uupsProxy = address(new ERC1967Proxy({_logic: _logic, _data: _data}));
    }

    /// @notice Creates an [ERC-1167](https://eips.ethereum.org/EIPS/eip-1167) minimal proxy contract pointing to a logic contract.
    /// @param _logic The logic contract the proxy is pointing to.
    /// @param _data The initialization data for this contract.
    /// @return minimalProxy The address of the minimal proxy contract created.
    /// @dev If `_data` is non-empty, it is used in a call to the clone contract. This will typically be an encoded function call initializing the storage of the contract.
    function deployMinimalProxy(
        address _logic,
        bytes memory _data
    ) internal returns (address minimalProxy) {
        minimalProxy = _logic.clone();
        if (_data.length > 0) {
            minimalProxy.functionCall({data: _data});
        }
    }
}
