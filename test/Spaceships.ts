// import { expect } from "chai";
// import { ethers } from "hardhat";

// describe("Spaceships", function () {

//   let acc1: any;

//   let acc2: any;

//   let acc3: any;

//   let spaceships: any;

//   let uri1155 = "ipfs://QmNoGpoqnYQ2iH1NnwPCRuzyCuo2v1chbiBMWJefm6TSFg"

//   beforeEach(async function() {
//     [acc1, acc2, acc3] = await ethers.getSigners()
//     const Spaceships = await ethers.getContractFactory('Spaceships', acc1)
//     spaceships = await Spaceships.deploy(uri1155)
//     await spaceships.deployed()  
//   })

//   it("should be deployed", async function(){
//     expect(spaceships.address).to.be.properAddress
//  })

//  it("can mint", async function(){
//     let tokenId = 1
//     let count = 2

//     const tx = await spaceships.safeMint(acc2.address, tokenId, count)
//     await tx.wait()

//     expect(await spaceships.balanceOf(acc2.address, tokenId)).to.equal(count)
//   })

//   it("can get token uri", async function(){
//     let tokenId = 1
//     let count = 2

//     const tx = await spaceships.safeMint(acc2.address, tokenId, count)
//     await tx.wait()

//     let uri = uri1155.concat("/1.json")
//     expect(await spaceships.uri(tokenId)).to.equal(uri)
//   })
// });


