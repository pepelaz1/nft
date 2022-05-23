
import { ethers } from "hardhat";

async function main() {

  const CustomERC721 = await ethers.getContractFactory("CustomERC721");
  const customERC721 = await CustomERC721.deploy();
  await customERC721.deployed();
  console.log("CustomERC721 deployed to:", customERC721.address);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);
 }

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


