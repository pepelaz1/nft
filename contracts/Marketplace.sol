//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Erc20Token.sol";
import "./Pepelaz721.sol";

contract Marketplace {
    address private immutable owner;

    Pepelaz721 private immutable token721;

    Erc20Token private immutable token20;

    mapping (uint256 => address) createdItems;

    struct SellOrder {
        address seller;
        uint256 price;
    }

    mapping (uint256 => SellOrder) sellingOrders;

    struct AuctionLot {
        address seller;
        uint256 curPrice;
        address curBidder;
        uint256 startTime;
        uint256 bidCount;
    }

    mapping (uint256 => AuctionLot) auctionLots;

    uint256 private constant successAuctionCount = 2;

    uint256 private constant auctionDuration = 3*24*60*60;

    constructor(address _address20, address _address721) {
        owner = msg.sender;
        token721 = Pepelaz721(_address721);
        token20 = Erc20Token(_address20);
    }

    function createItem(string memory _tokenUri, address _owner) public {  
        uint256 tokenId = token721.safeMint(_owner, _tokenUri);
        createdItems[tokenId] = _owner;
    }
    
    function listItem(uint256 _tokenId, uint256 _price) public { 
        address seller = createdItems[_tokenId];
        require(seller != address(0), "Can't find listed item");

        SellOrder memory order = SellOrder({seller: seller, price: _price});
        sellingOrders[_tokenId] = order;
        createdItems[_tokenId] = address(0);
    }

    function isItemListed(uint256 _tokenId) public view returns(bool) {
        address seller = sellingOrders[_tokenId].seller;
        return seller != address(0);
    }

    function resetOrder(uint256 _tokenId) private {
        sellingOrders[_tokenId].seller = address(0);
        sellingOrders[_tokenId].price = 0;
    }

    function cancel(uint256 _tokenId) public {  
        address seller = sellingOrders[_tokenId].seller;
        createdItems[_tokenId] = seller;

        resetOrder(_tokenId);
    }

    function buyItem(uint256 _tokenId) public {  
        address seller = sellingOrders[_tokenId].seller;
        require(seller != address(0), "Can't find selling item");

        token20.transferFrom(msg.sender, seller, sellingOrders[_tokenId].price);
        token721.safeTransferFrom(seller, msg.sender, _tokenId);

        resetOrder(_tokenId);
        createdItems[_tokenId] = address(0);
    }

 
    function listItemOnAuction(uint256 _tokenId, uint _minPrice) public {  
        address seller = createdItems[_tokenId];
        require(seller != address(0), "Can't find listed item on auction");

        AuctionLot memory lot = AuctionLot({seller: seller, curPrice: _minPrice, curBidder: address(0), startTime: block.timestamp, bidCount: 0});
        auctionLots[_tokenId] = lot;
        createdItems[_tokenId] = address(0);
    }

    function isItemListedOnAuction(uint256 _tokenId) public view returns(bool) {
        address seller = auctionLots[_tokenId].seller;
        return seller != address(0);
    }

    function makeBid(uint256 _tokenId, uint _price) public {  
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

    function finishAuction(uint256 _tokenId) public {
        address seller = auctionLots[_tokenId].seller;  
        require(seller != address(0), "Can't find the item up for auction");
        require(block.timestamp >= auctionLots[_tokenId].startTime + auctionDuration, "Auction is not over yet");

        if (auctionLots[_tokenId].bidCount >= successAuctionCount) {
            token20.transfer(seller, auctionLots[_tokenId].curPrice);
            token721.safeTransferFrom(seller, msg.sender, _tokenId);
        } else {
            token20.transfer(auctionLots[_tokenId].curBidder, auctionLots[_tokenId].curPrice);
        }
    }
}
