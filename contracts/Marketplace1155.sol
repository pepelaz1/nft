//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract Marketplace1155 {

    function createItem2(address _owner, uint256 _tokenId, uint256 _count) public virtual;  

    function buyItem2(uint256 _tokenId) public virtual;

    function finishAuction2(uint256 _tokenId) public virtual;
}