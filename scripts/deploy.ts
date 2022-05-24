
import { ethers } from "hardhat";

async function main() {

  let [acc] = await ethers.getSigners()

  // const Pepelaz721 = await ethers.getContractFactory("Pepelaz721");
  // const pepelaz721 = await Pepelaz721.deploy("Pepelaz721", "PPLZ1");
  // await pepelaz721.deployed();
  // console.log("Pepelaz721 deployed to:", pepelaz721.address);

  // await pepelaz721.safeMint(acc.address, "ipfs://QmatR9iJNxKCFJu4hTmtgVHrVkkCNMouwm4j1MWD5Nocxo", {from: acc.address})

  const Spaceships = await ethers.getContractFactory("Spaceships");
  const spaceships = await Spaceships.deploy();
  await spaceships.deployed();
  console.log("Spaceships deployed to:", spaceships.address);

  //await pepelaz721.safeMint(acc.address, "ipfs://QmatR9iJNxKCFJu4hTmtgVHrVkkCNMouwm4j1MWD5Nocxo", {from: acc.address})

  // const Marketplace = await ethers.getContractFactory("Marketplace");
  // const marketplace = await Marketplace.deploy();
  // await marketplace.deployed();
  // console.log("Marketplace deployed to:", marketplace.address);
 }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


