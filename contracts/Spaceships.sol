//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Spaceships is ERC1155 {

    uint256 public constant Pepelaz = 1;

    uint256 public constant Endeavour = 2;

    uint256 public constant Enterprise = 3;

    uint256 public constant Falcon = 4;

    uint256 public constant Pegas = 5;

    string public name = "Spaceships";

    constructor() ERC1155("https://ipfs.io/ipfs/QmNoGpoqnYQ2iH1NnwPCRuzyCuo2v1chbiBMWJefm6TSFg/{id}.json") {
        _mint(msg.sender, Pepelaz, 5, "");
        _mint(msg.sender, Endeavour, 10, "");
        _mint(msg.sender, Enterprise, 7, "");
        _mint(msg.sender, Falcon, 15, "");
        _mint(msg.sender, Pegas, 9, "");
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "https://ipfs.io/ipfs/QmNoGpoqnYQ2iH1NnwPCRuzyCuo2v1chbiBMWJefm6TSFg/",
                Strings.toString(_tokenid),".json"
            )
        );
    }

     function contractURI() public pure returns (string memory) {
        return "ipfs://QmRwD1ryVpNdDPVcXrAskWq2oFWHRHmSb5vBpj35MDeK7z";
    }

}