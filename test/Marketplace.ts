import { expect } from "chai";
import { ethers,network } from "hardhat";
const { parseEther } = ethers.utils;
const { MaxUint256 } = ethers.constants;

describe("Marketplace", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let acc4: any;

  let token20: any;

  let token721: any;

  let marketplace: any;

  let uri721 = "ipfs://QmatR9iJNxKCFJu4hTmtgVHrVkkCNMouwm4j1MWD5Nocxo";

  beforeEach(async function() {
    [acc1, acc2, acc3, acc4] = await ethers.getSigners()

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
    marketplace = await Marketplace.deploy(token20.address, token721.address)
    await marketplace.deployed() 
    
    // transfer ownership of token to marketplace contract
    await token721.transferOwnership(marketplace.address)

    
    // mint some tokens
    await token20.mint(acc3.address, parseEther("300"))
    await token20.mint(acc4.address, parseEther("400"))

    // approve
    await token20.connect(acc2).approve(marketplace.address, MaxUint256)
    await token20.connect(acc3).approve(marketplace.address, MaxUint256)
    await token20.connect(acc4).approve(marketplace.address, MaxUint256)

    await token721.connect(acc2).setApprovalForAll(marketplace.address, true)
    await token721.connect(acc3).setApprovalForAll(marketplace.address, true)
    await token721.connect(acc4).setApprovalForAll(marketplace.address, true)
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
    await expect(token721.safeMint(acc2.address, uri721)).to.be.revertedWith("Ownable: caller is not the owner")
  })


  it("can list item", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    tx = await marketplace.listItem(0, parseEther("20"))
    await tx.wait()

    expect(await marketplace.isItemListed(0)).to.equal(true)
  })


  it("can't list absent item", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    await expect(marketplace.listItem(1, parseEther("20"))).to.be.revertedWith("Can't find listed item")
  })


  it("can cancel item listing", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    tx = await marketplace.listItem(0, parseEther("20"))
    await tx.wait()

    tx = await marketplace.cancel(0)
    await tx.wait()

    expect(await marketplace.isItemListed(0)).to.equal(false)
  })


  it("can buy item", async function(){
    let tokenId = 0

    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    expect(await token721.ownerOf(tokenId)).to.equal(acc2.address)

    tx = await marketplace.listItem(tokenId, parseEther("20"))
    await tx.wait()

    tx = await marketplace.connect(acc3).buyItem(tokenId)
    await tx.wait()

    expect(await token20.balanceOf(acc2.address)).to.equal(parseEther("20"))
    expect(await token721.ownerOf(tokenId)).to.equal(acc3.address)
  })


  it("can't buy absent item", async function(){
    let tokenId = 0

    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    expect(await token721.ownerOf(tokenId)).to.equal(acc2.address)

    tx = await marketplace.listItem(tokenId, parseEther("20"))
    await tx.wait()

    await expect(marketplace.connect(acc3).buyItem(1111)).to.be.revertedWith("Can't find selling item")
  })



  it("can trade items", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItem(tokenId, parseEther("20"))
    await tx.wait()
 
    tx = await marketplace.connect(acc3).buyItem(tokenId)
    await tx.wait()

    tx = await marketplace.createItem(uri721, acc3.address)
    await tx.wait()

    tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItem(tokenId, parseEther("20"))
    await tx.wait()

    tx = await marketplace.connect(acc2).buyItem(tokenId)
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("300"))
    expect(await token721.ownerOf(tokenId)).to.equal(acc2.address)
  })

  
  it("can list item on auction", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)
  })

  it("can't list absent item on auction", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    await expect(marketplace.listItemOnAuction(555, parseEther("20"))).to.be.revertedWith("Can't find listed item on auction")
  })


  it("can make a bid", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    tx = await marketplace.connect(acc3).makeBid(tokenId, parseEther("4"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)
    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("296"))
  })

  it("can make a bid higher than current", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)

    tx = await marketplace.connect(acc3).makeBid(tokenId, parseEther("4"))
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("296"))

    tx = await marketplace.connect(acc4).makeBid(tokenId, parseEther("5"))
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("300"))
    expect(await token20.balanceOf(acc4.address)).to.equal(parseEther("395"))
  })


  it("can't make bid for absent item", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    await expect(marketplace.connect(acc3).makeBid(9999, parseEther("3"))).to.be.revertedWith("Can't find the item up for auction")
  })


  it("can't make bid with lower price", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    await expect(marketplace.connect(acc3).makeBid(tokenId, parseEther("2"))).to.be.revertedWith("Bid price must be higher that current")
  })


  it("can finish auction with success", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)

    tx = await marketplace.connect(acc3).makeBid(tokenId, parseEther("4"))
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("296"))

    tx = await marketplace.connect(acc4).makeBid(tokenId, parseEther("5"))
    await tx.wait()

    await network.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]) // add 3 days and 1 sec to current time

    tx = await marketplace.connect(acc4).finishAuction(tokenId)
    await tx.wait()
    
    expect(await token20.balanceOf(acc2.address)).to.equal(parseEther("5"))
    expect(await token721.ownerOf(tokenId)).to.equal(acc4.address)
  })

  it("can finish auction with failure", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)

    tx = await marketplace.connect(acc3).makeBid(tokenId, parseEther("4"))
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("296"))

    await network.provider.send("evm_increaseTime", [3 * 24 * 60 * 60 + 1]) // add 3 days and 1 sec to current time

    await expect(marketplace.connect(acc3).makeBid(tokenId, parseEther("2"))).to.be.revertedWith("Bid price must be higher that current")

    tx = await marketplace.connect(acc4).finishAuction(tokenId)
    await tx.wait()
    
    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("300"))
    expect(await token721.ownerOf(tokenId)).to.equal(acc2.address)
  })



  it("can't finish auction before duration elapsed", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)

    tx = await marketplace.connect(acc3).makeBid(tokenId, parseEther("4"))
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("296"))
    
    await expect(marketplace.connect(acc4).finishAuction(tokenId)).to.be.revertedWith("Auction is not over yet")
  })



  it("can't finish auction for absent item", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await marketplace.listItemOnAuction(tokenId, parseEther("3"))
    await tx.wait()

    expect(await marketplace.isItemListedOnAuction(tokenId)).to.equal(true)

    tx = await marketplace.connect(acc3).makeBid(tokenId, parseEther("4"))
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("296"))

    tx = await marketplace.connect(acc4).makeBid(tokenId, parseEther("5"))
    await tx.wait()

    await expect(marketplace.connect(acc4).finishAuction(9999)).to.be.revertedWith("Can't find the item up for auction")
  })

});


