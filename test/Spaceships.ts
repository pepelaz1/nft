import { expect } from "chai";
import { ethers } from "hardhat";

describe("Spaceships", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let spaceships: any;

  beforeEach(async function() {
    [acc1, acc2, acc3] = await ethers.getSigners()
    const Spaceships = await ethers.getContractFactory('Spaceships', acc1)
    spaceships = await Spaceships.deploy()
    await spaceships.deployed()  
  })

  it("should be deployed", async function(){
    expect(spaceships.address).to.be.properAddress
 })
});


