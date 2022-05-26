//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Spaceships is ERC1155, Ownable {

    string public name = "Spaceships";

    string private uri_;

    constructor(string memory _uri) ERC1155(string(abi.encodePacked(_uri, "/{id}.json"))) {
         uri_ = _uri;
    }

    function uri(uint256 _tokenid) override public view returns (string memory) {
       return string(abi.encodePacked(uri_, "/", Strings.toString(_tokenid),".json"));
    }

    function safeMint(address _to, uint256 _tokenId, uint256 _count) public onlyOwner {
        _mint(_to, _tokenId, _count, "");
    }
}