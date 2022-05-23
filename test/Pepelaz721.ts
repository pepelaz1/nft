import { expect } from "chai";
import { ethers } from "hardhat";

describe("Pepelaz721", function () {

  let acc1: any;

  let acc2: any;

  let acc3: any;

  let pepelaz721: any;

  beforeEach(async function() {
    [acc1, acc2, acc3] = await ethers.getSigners()
    const Pepelaz721 = await ethers.getContractFactory('Pepelaz721', acc1)
    pepelaz721 = await Pepelaz721.deploy()
    await pepelaz721.deployed()  
  })

  it("should be deployed", async function(){
    expect(pepelaz721.address).to.be.properAddress
 })
});


