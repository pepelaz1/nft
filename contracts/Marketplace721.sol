//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BaseMarketplace.sol";
import "./Pepelaz721.sol";

abstract contract Marketplace721 is BaseMarketplace {

    Pepelaz721 internal immutable token721;

    constructor(address _address721) {
        token721 = Pepelaz721(_address721);
    }

    function createItem(string memory _tokenUri, address _owner) public {  
        token721.safeMint(_owner, _tokenUri);
    }

    function listItem(uint256 _tokenId, uint256 _price) public { 
        address seller = token721.ownerOf(_tokenId);
        require(seller == owner, "Only owner can list");

        SellOrder memory order = SellOrder({seller: seller, price: _price, count: 1});
        sellingOrders[_tokenId] = order;

        token721.safeTransferFrom(msg.sender, address(this), _tokenId);
    }

    function buyItem(uint256 _tokenId) public {  
        address seller = sellingOrders[_tokenId].seller;
        require(seller != address(0), "Can't find selling item");

        token20.transferFrom(msg.sender, seller, sellingOrders[_tokenId].price);
        token721.safeTransferFrom(address(this), msg.sender, _tokenId);

        delete sellingOrders[_tokenId];
    }


    function listItemOnAuction(uint256 _tokenId, uint _minPrice) public {  
        address seller = token721.ownerOf(_tokenId);
        require(seller == owner, "Only owner can list on auction");

        AuctionLot memory lot = AuctionLot({
            seller: seller, 
            curPrice: _minPrice, 
            count: 1,
            curBidder: address(0),
            startTime: block.timestamp, 
            bidCount: 0});

        auctionLots[_tokenId] = lot;
        token721.safeTransferFrom(msg.sender, address(this), _tokenId);
    }


    function finishAuction(uint256 _tokenId) public {
        address seller = auctionLots[_tokenId].seller;  
        require(seller != address(0), "Can't find the item up for auction");
        require(block.timestamp >= auctionLots[_tokenId].startTime + auctionDuration, "Auction is not over yet");

        if (auctionLots[_tokenId].bidCount >= successAuctionCount) {
            token20.transfer(seller, auctionLots[_tokenId].curPrice);
            token721.safeTransferFrom(address(this), msg.sender, _tokenId);
        } else {
            token20.transfer(auctionLots[_tokenId].curBidder, auctionLots[_tokenId].curPrice);
        }
    }
}