//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./Pepelaz721.sol";

contract Marketplace {
    address private immutable owner;

    Pepelaz721 private immutable token721;

    //Erc20Token private immutable rewardToken;

    //mapping (address => string) blocke;

    constructor(address _address721) {
        owner = msg.sender;
        token721 = Pepelaz721(_address721);
    }

    function createItem(string memory _tokenUri, address _owner) public {  
        //token721.transferOwnership(address(this));
        //Pepelaz721 token = Pepelaz721.safeMint(address(this), _tokenUri);
    
        token721.safeMint(_owner, _tokenUri);
    }
    
    function listItem() public {  
       
    }

    function buyItem() public {  
    }

    function cancel() public {  
    }

    function listItemOnAuction() public {  
    }

    function makeBid() public {  
    }

    function finishAuction() public {  
    }
}
