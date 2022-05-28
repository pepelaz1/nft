//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Erc20Token.sol";

abstract contract BaseMarketplace {
    struct SellOrder {
        address seller;
        uint256 price;
        uint256 count;
    }

    struct AuctionLot {
        address seller;
        uint256 curPrice;
        address curBidder;
        uint256 startTime;
        uint256 bidCount;
    }

    address internal immutable owner;

    uint256 internal constant successAuctionCount = 2;

    uint256 internal constant auctionDuration = 3 days;

    Erc20Token internal immutable token20;

    mapping(uint256 => address) internal createdItems;

    mapping(uint256 => SellOrder) public sellingOrders;

    mapping(uint256 => AuctionLot) public auctionLots;

    constructor(address _address20) { 
        owner = msg.sender;
        token20 = Erc20Token(_address20);
    }

    function createItem(string memory _tokenUri, address _owner) public virtual;  

    function createItem(address _owner, uint256 _tokenId, uint256 _count) public virtual;  

    function listItem(uint256 _tokenId, uint256 _price) public virtual; 

    function listItem(uint256 _tokenId, uint256 _price, uint256 _count) public virtual; 

    function buyItem(uint256 _tokenId) public virtual;

    function buyItem(uint256 _tokenId, uint256 _count) public virtual;

    function cancel(uint256 _tokenId) public  {  
        address seller = sellingOrders[_tokenId].seller;
        createdItems[_tokenId] = seller;

        _resetOrder(_tokenId);
    }

    function listItemOnAuction(uint256 _tokenId, uint _minPrice) public {  
        address seller = createdItems[_tokenId];
        require(seller != address(0), "Can't find listed item on auction");

        AuctionLot memory lot = AuctionLot({seller: seller, curPrice: _minPrice, curBidder: address(0), startTime: block.timestamp, bidCount: 0});
        auctionLots[_tokenId] = lot;
        createdItems[_tokenId] = address(0);
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

    function finishAuction(uint256 _tokenId) public virtual; 

    function finishAuction2(uint256 _tokenId) public virtual; 

    function _resetOrder(uint256 _tokenId) internal {
        sellingOrders[_tokenId].seller = address(0);
        sellingOrders[_tokenId].price = 0;
    }
}