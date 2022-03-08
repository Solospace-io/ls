const hre = require("hardhat");
const ethers = require("ethers");
const fs = require('fs');
const debug = require('debug')("Deploy:");
debug.color = "158";
debug.enabled = true;
const { marketplaceAddress } = require("../config");


async function main() {

    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketPlace");
    const nftMarketplace = await hre.upgrades.upgradeProxy(marketplaceAddress, NFTMarketplace);
    await nftMarketplace.deployed();
    debug("nftMarketplace upgraded to:", nftMarketplace.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    debug(error);
    process.exit(1);
  });
