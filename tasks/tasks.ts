import { HardhatUserConfig, task } from "hardhat/config";


task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
  
    for (const account of accounts) {
      console.log(account.address);
    }
  });
  


  task("createItem", "Create item")
  .addParam("address","Address of the contract")
  .addParam("tokenUri","Token URI")
  .addParam("owner","Address of owner")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenUri: tokenUri, owner: owner } = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.createItem(tokenUri, owner);
  });
  

  task("listItem", "List item")
  .addParam("address","Address of the contract")
  .addParam("tokenId","Token id")
  .addParam("price","Price")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenId: tokenId, price: price} = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.listItem(tokenId, price);
  });

 
  
  task("cancel", "Cancel")
  .addParam("address","Address of the contract")
  .addParam("tokenId","Token id")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenId: tokenId} = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.cancel(tokenId);
  });


  task("buyItem", "Buy item")
  .addParam("address","Address of the contract")
  .addParam("tokenId","Token id")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenId: tokenId} = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.buyItem(tokenId);
  });

  task("listItemOnAuction", "List item on auction")
  .addParam("address","Address of the contract")
  .addParam("tokenId","Token id")
  .addParam("minPrice","minPrice")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenId: tokenId, minPrice: minPrice} = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.listItemOnAuction(tokenId, minPrice);
  });

  task("makeBid", "Make bid")
  .addParam("address","Address of the contract")
  .addParam("tokenId","Token id")
  .addParam("price","price")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenId: tokenId, price: price} = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.makeBid(tokenId, price);
  });

  task("finishAuction", "Finish auction")
  .addParam("address","Address of the contract")
  .addParam("tokenId","Token id")
  .setAction(async (taskArgs, hre) => {
      const { address: address, tokenId: tokenId} = taskArgs;
      const { abi } = await hre.artifacts.readArtifact("Marketplace");
      const [signer] = await hre.ethers.getSigners();
  
      const contract = new hre.ethers.Contract(
          address, abi, signer
      )
      contract.finishAuction(tokenId);
  });

 