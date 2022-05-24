import { expect } from "chai";
import { ethers } from "hardhat";

describe("Marketplace", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let token20: any;

  let token721: any;

  let marketplace: any;

  let uri721 = "ipfs://QmatR9iJNxKCFJu4hTmtgVHrVkkCNMouwm4j1MWD5Nocxo";

  beforeEach(async function() {
    [acc1, acc2, acc3] = await ethers.getSigners()

    // deploy ERC20 token
    const Erc20Token = await ethers.getContractFactory('Erc20Token', acc1)
    token20 = await Erc20Token.deploy("Pepelaz","PPLZ", ethers.utils.parseEther("10000"))
    await token20.deployed()  

    // deploy ERC721 token
    const Pepelaz721 = await ethers.getContractFactory('Pepelaz721', acc1)
    token721 = await Pepelaz721.deploy('Pepelaz721','PPLZ1')
    await token721.deployed() 

    // deploy marketplace
    const Marketplace = await ethers.getContractFactory('Marketplace', acc1)
    marketplace = await Marketplace.deploy(token721.address)
    await marketplace.deployed() 
    
    // transfer ownership of token to marketplace contract
    await token721.transferOwnership(marketplace.address)
  })

  it("should be deployed", async function(){
    expect(marketplace.address).to.be.properAddress
  })


  it("can create item", async function(){
    const tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    expect(await token721.balanceOf(acc2.address)).to.equal(1)
  })

  it("only marketplace can mint", async function(){
    await expect(token721.safeMint(acc2.address, uri721)).to.be.revertedWith("Ownable: caller is not the owner");  
  })
});


