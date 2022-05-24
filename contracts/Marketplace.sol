//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Erc20Token.sol";
import "./Pepelaz721.sol";

contract Marketplace {
    address private immutable owner;

    Pepelaz721 private immutable token721;

    Erc20Token private immutable token20;

    mapping (string => uint256) itemIds;

    mapping (uint256 => address) createdItems;

    struct SellOrder {
        address seller;
        uint256 price;
    }

    mapping (uint256 => SellOrder) sellingOrders;

    constructor(address _address20, address _address721) {
        owner = msg.sender;
        token721 = Pepelaz721(_address721);
        token20 = Erc20Token(_address20);
    }

    function createItem(string memory _tokenUri, address _owner) public {  
        uint256 tokenId = token721.safeMint(_owner, _tokenUri);
        createdItems[tokenId] = _owner;
        itemIds[_tokenUri] = tokenId;
    }

    function getItemId(string memory _tokenUri) public view returns (uint256) {
        return itemIds[_tokenUri];
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
        
        itemIds[token721.tokenURI(_tokenId)] = 0;
    }

 
    function listItemOnAuction() public {  
    }

    function makeBid() public {  
    }

    function finishAuction() public {  
    }
}
