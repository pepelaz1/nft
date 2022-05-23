import { expect } from "chai";
import { ethers } from "hardhat";

describe("CustomERC721", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let customErc721: any;

  beforeEach(async function() {
    [acc1, acc2, acc3] = await ethers.getSigners()
    const CustomERC721 = await ethers.getContractFactory('CustomERC721', acc1)
    customErc721 = await CustomERC721.deploy()
    await customErc721.deployed()  
  })

  it("should be deployed", async function(){
    expect(customErc721.address).to.be.properAddress
 })
});


