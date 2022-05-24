import { expect } from "chai";
import { parseTransaction } from "ethers/lib/utils";
import { ethers } from "hardhat";
const { parseEther } = ethers.utils;
const { MaxUint256 } = ethers.constants;

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
    marketplace = await Marketplace.deploy(token20.address, token721.address)
    await marketplace.deployed() 
    
    // transfer ownership of token to marketplace contract
    await token721.transferOwnership(marketplace.address)

    
    await token20.mint(acc3.address, parseEther("300"))

    await token20.connect(acc2).approve(marketplace.address, MaxUint256)
    await token20.connect(acc3).approve(marketplace.address, MaxUint256)

    await token721.connect(acc2).setApprovalForAll(marketplace.address, true)
    await token721.connect(acc3).setApprovalForAll(marketplace.address, true)
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


  it("can trade items", async function(){
    let tx = await marketplace.createItem(uri721, acc2.address)
    await tx.wait()

    let tokenId = await marketplace.getItemId(uri721)

    tx = await marketplace.listItem(tokenId, parseEther("20"))
    await tx.wait()

 
    tx = await marketplace.connect(acc3).buyItem(tokenId)
    await tx.wait()

    tx = await marketplace.createItem(uri721, acc3.address)
    await tx.wait()

    tokenId = await marketplace.getItemId(uri721)

    tx = await marketplace.listItem(tokenId, parseEther("20"))
    await tx.wait()

    tx = await marketplace.connect(acc2).buyItem(tokenId)
    await tx.wait()

    expect(await token20.balanceOf(acc3.address)).to.equal(parseEther("300"))
    expect(await token721.ownerOf(tokenId)).to.equal(acc2.address)
  })

  
});


