//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./BaseMarketplace.sol";
import "./Pepelaz721.sol";

abstract contract Marketplace721 is BaseMarketplace {

    Pepelaz721 internal immutable token721;

    constructor(address _address721) {
        token721 = Pepelaz721(_address721);
    }


    function createItem(string memory _tokenUri, address _owner) public  {  
        uint256 tokenId = token721.safeMint(_owner, _tokenUri);
        createdItems[tokenId] = _owner;
    }
    
    function buyItem(uint256 _tokenId) public  {  
        address seller = sellingOrders[_tokenId].seller;
        require(seller != address(0), "Can't find selling item");

        token20.transferFrom(msg.sender, seller, sellingOrders[_tokenId].price);
        token721.safeTransferFrom(seller, msg.sender, _tokenId);

        resetOrder(_tokenId);
        createdItems[_tokenId] = address(0);
    }

    function finishAuction(uint256 _tokenId) public  {
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