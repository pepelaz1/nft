import { expect } from "chai";
import { ethers } from "hardhat";

describe("Erc20Token", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let marketplace: any;

  beforeEach(async function() {
    [acc1, acc2, acc3] = await ethers.getSigners()
    const Marketplace = await ethers.getContractFactory('Marketplace', acc1)
    marketplace = await Marketplace.deploy()
    await marketplace.deployed()  
  })

  it("should be deployed", async function(){
    expect(marketplace.address).to.be.properAddress
 })
});


