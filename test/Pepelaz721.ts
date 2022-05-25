import { expect } from "chai";
import { ethers } from "hardhat";

describe("Pepelaz721", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let token721: any;

  let uri721 = "ipfs://QmatR9iJNxKCFJu4hTmtgVHrVkkCNMouwm4j1MWD5Nocxo";

  beforeEach(async function() {
    [acc1, acc2, acc3] = await ethers.getSigners()
    const Pepelaz721 = await ethers.getContractFactory('Pepelaz721', acc1)
    token721 = await Pepelaz721.deploy('Pepelaz721',"PPLZ1")
    await token721.deployed()  
  })

  it("should be deployed", async function(){
    expect(token721.address).to.be.properAddress
  })

  it("can mint", async function(){
    const tx = await token721.safeMint(acc2.address, uri721)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    expect(await token721.ownerOf(tokenId)).to.equal(acc2.address)
  })

  it("can burn", async function(){
    let tx = await token721.safeMint(acc2.address, uri721)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    tx = await token721.safeBurn(tokenId)
    await tx.wait()

    await expect(token721.ownerOf(tokenId)).to.be.revertedWith("ERC721: owner query for nonexistent token")
  })

  it("can get token uri", async function(){
    let tx = await token721.safeMint(acc2.address, uri721)
    await tx.wait()

    let tokenId = await token721.getIdForUri(uri721)

    expect(await token721.tokenURI(tokenId)).to.equal(uri721)
  })

});


