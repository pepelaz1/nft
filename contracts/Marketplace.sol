//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BaseMarketplace.sol";
import "./Marketplace721.sol";
import "./Marketplace1155.sol";

contract Marketplace is Marketplace721, Marketplace1155 {

    constructor(address _address20, address _address721, address _address1155)
         BaseMarketplace(_address20)
         Marketplace721( _address721)
         Marketplace1155( _address1155) {   
    }
}
