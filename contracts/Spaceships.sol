//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Spaceships is ERC1155, Ownable {

    // uint256 public constant Pepelaz = 1;

    // uint256 public constant Endeavour = 2;

    // uint256 public constant Enterprise = 3;

    // uint256 public constant Falcon = 4;

    // uint256 public constant Pegas = 5;

    string public name = "Spaceships";

    string private uri2;

    constructor(string memory _uri) ERC1155(string(abi.encodePacked(_uri, "/{id}.json"))) {
         uri2 = _uri;
        // _mint(msg.sender, Pepelaz, 5, "");
        // _mint(msg.sender, Endeavour, 10, "");
        // _mint(msg.sender, Enterprise, 7, "");
        // _mint(msg.sender, Falcon, 15, "");
        // _mint(msg.sender, Pegas, 9, "");
    }

    function uri(uint256 _tokenid) override public view returns (string memory) {
       return string(abi.encodePacked(uri2, "/", Strings.toString(_tokenid),".json"));
    }

    function safeMint(address _to, uint256 _tokenId, uint256 _count) public onlyOwner {
        _mint(_to, _tokenId, _count, "");
    }
}