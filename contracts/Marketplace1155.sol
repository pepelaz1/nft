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
         createdItems[_tokenId] = _owner;
    }

    function buyItem2(uint256 _tokenId) public {  
        address seller = sellingOrders[_tokenId].seller;
        uint256 price  = sellingOrders[_tokenId].price;

        require(seller != address(0), "Can't find selling item");

        uint256 count = token1155.balanceOf(seller, _tokenId);
        token20.transferFrom(msg.sender, seller, price * count);
        token1155.safeTransferFrom(seller, msg.sender, _tokenId, count, ""); 

        resetOrder(_tokenId);
        createdItems[_tokenId] = address(0);
    }    

     function finishAuction2(uint256 _tokenId) public  {
        address seller = auctionLots[_tokenId].seller;  
        require(seller != address(0), "Can't find the item up for auction");
        require(block.timestamp >= auctionLots[_tokenId].startTime + auctionDuration, "Auction is not over yet");

        if (auctionLots[_tokenId].bidCount >= successAuctionCount) {
            token20.transfer(seller, auctionLots[_tokenId].curPrice);

            uint256 count = token1155.balanceOf(seller, _tokenId);
            token1155.safeTransferFrom(seller, msg.sender, _tokenId, count, ""); 
        } else {
            token20.transfer(auctionLots[_tokenId].curBidder, auctionLots[_tokenId].curPrice);
        }
    }
}