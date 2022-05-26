//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

abstract contract Marketplace721 {

    function createItem(string memory _tokenUri, address _owner) public virtual;

    function listItem(uint256 _tokenId, uint256 _price) public virtual;

    function cancel(uint256 _tokenId) public virtual;

    function buyItem(uint256 _tokenId) public virtual;

    function listItemOnAuction(uint256 _tokenId, uint _minPrice) public virtual;

    function makeBid(uint256 _tokenId, uint _price) public virtual;

    function finishAuction(uint256 _tokenId) public virtual;
}