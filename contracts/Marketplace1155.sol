//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BaseMarketplace.sol";
import "./Spaceships.sol";

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

abstract contract Marketplace1155 is BaseMarketplace, ERC1155Holder {

    Spaceships internal immutable token1155;

    constructor(address _address1155) {
        token1155 = Spaceships(_address1155);
    }

    function createItem(address _owner, uint256 _tokenId, uint256 _count) public {  
         token1155.safeMint(_owner, _tokenId, _count);
    }

    function listItem(uint256 _tokenId, uint256 _price, uint256 _count) public { 
        address seller = msg.sender;
        require(seller != address(0), "Can't find listed item");

        SellOrder memory order = SellOrder({seller: seller, price: _price, count: _count});
        sellingOrders[_tokenId] = order;
    }

    function buyItem(uint256 _tokenId, uint256 _count) public {  
        address seller = sellingOrders[_tokenId].seller;
        uint256 price  = sellingOrders[_tokenId].price;

        require(seller != address(0), "Can't find selling item");
        require(_count  <= sellingOrders[_tokenId].count,  "Can't buy more than exising item count");

        token20.transferFrom(msg.sender, seller, price * _count);
        token1155.safeTransferFrom(seller, msg.sender, _tokenId, _count, ""); 

        sellingOrders[_tokenId].count -= _count;

        if (sellingOrders[_tokenId].count == 0) {
            _resetOrder(_tokenId);
        }
    }    

    function listItemOnAuction(uint256 _tokenId, uint _minPrice, uint256 _count) public {  
        address seller = msg.sender;
        require(seller != address(0), "Can't find listed item on auction");

        AuctionLot memory lot = AuctionLot({seller: seller, curPrice: _minPrice, count: _count, curBidder: address(0), startTime: block.timestamp, bidCount: 0});
        auctionLots[_tokenId] = lot;
    }


    function finishAuction2(uint256 _tokenId) public {
        address seller = auctionLots[_tokenId].seller;  
        require(seller != address(0), "Can't find the item up for auction");
        require(block.timestamp >= auctionLots[_tokenId].startTime + auctionDuration, "Auction is not over yet");

        if (auctionLots[_tokenId].bidCount >= successAuctionCount) {
            token20.transfer(seller, auctionLots[_tokenId].curPrice);
            token1155.safeTransferFrom(seller, msg.sender, _tokenId, auctionLots[_tokenId].count, ""); 
        } else {
            token20.transfer(auctionLots[_tokenId].curBidder, auctionLots[_tokenId].curPrice);
        }
    }
}