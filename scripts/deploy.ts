
import { ethers } from "hardhat";

async function main() {

  const Pepelaz721 = await ethers.getContractFactory("Pepelaz721");
  const pepelaz721 = await Pepelaz721.deploy();
  await pepelaz721.deployed();
  console.log("Pepelaz721 deployed to:", pepelaz721.address);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
 }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


