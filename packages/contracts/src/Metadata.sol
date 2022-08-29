// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import "solmate/auth/Owned.sol";
import "openzeppelin/utils/Strings.sol";
import "./IMetadata.sol";

contract Metadata is IMetadata, Owned {
    using Strings for uint256;

    string internal _baseTokenURI;

    constructor(address owner, string memory baseTokenURI_) Owned(owner) {
        _baseTokenURI = baseTokenURI_;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string.concat(_baseTokenURI, tokenId.toString());
    }

    function setBaseTokenURI(string memory baseTokenURI_) external onlyOwner {
        _baseTokenURI = baseTokenURI_;
    }
}
