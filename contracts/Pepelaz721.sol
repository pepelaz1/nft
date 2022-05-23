//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Pepelaz721 is ERC721 {
    constructor() ERC721("Pepelaz", "PPLZ") {}

    function tokenURI(uint256 _tokenId) public override view returns (string memory) {
         return "ipfs:\\QmatR9iJNxKCFJu4hTmtgVHrVkkCNMouwm4j1MWD5Nocxo";
    }

}