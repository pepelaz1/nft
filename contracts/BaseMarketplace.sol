//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Erc20Token.sol";

contract BaseMarketplace {
    struct SellOrder {
        address seller;
        uint256 price;
        uint256 count;
    }

    struct AuctionLot {
        address seller;
        uint256 curPrice;
        uint256 count;
        address curBidder;
        uint256 startTime;
        uint256 bidCount;
    }

    address internal immutable owner;

    uint256 internal constant successAuctionCount = 2;

    uint256 internal constant auctionDuration = 3 days;

    Erc20Token internal immutable token20;

    mapping(uint256 => SellOrder) public sellingOrders;

    mapping(uint256 => AuctionLot) public auctionLots;

    constructor(address _address20) { 
        owner = msg.sender;
        token20 = Erc20Token(_address20);
    }

    function cancel(uint256 _tokenId) public  {  
        _resetOrder(_tokenId);
    }

    function makeBid(uint256 _tokenId, uint _price) public  {  
        address seller = auctionLots[_tokenId].seller;
        require(seller != address(0), "Can't find the item up for auction");
        require(_price > auctionLots[_tokenId].curPrice, "Bid price must be higher that current");

        if (auctionLots[_tokenId].curBidder != address(0)) {
            // return tokens to previous bidder
            token20.transfer(auctionLots[_tokenId].curBidder, auctionLots[_tokenId].curPrice);
        } 
        auctionLots[_tokenId].curPrice = _price;
        auctionLots[_tokenId].curBidder = msg.sender;
        auctionLots[_tokenId].bidCount += 1;

        // lock to token from current bidder on marketplace
        token20.transferFrom(msg.sender, address(this), auctionLots[_tokenId].curPrice);
    }

    function _resetOrder(uint256 _tokenId) internal {
        delete sellingOrders[_tokenId];
    }
}