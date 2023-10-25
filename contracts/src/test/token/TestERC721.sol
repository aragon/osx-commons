// SPDX-License-Identifier: AGPL-3.0-or-later

pragma solidity ^0.8.8;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @title TestERC721
/// @author Aragon Association - 2022-2023
/// @notice A test [ERC-721](https://eips.ethereum.org/EIPS/eip-721) that can be minted and burned by everyone.
/// @dev DO NOT USE IN PRODUCTION!
contract TestERC721 is ERC721 {
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(address account, uint256 tokenId) public {
        _mint(account, tokenId);
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}
