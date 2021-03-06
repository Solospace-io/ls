const hre = require("hardhat");
const ethers = require("ethers");
const fs = require('fs');
const debug = require('debug')("Deploy:");
debug.color = "158";
debug.enabled = true;

async function main() {

    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketPlace");
    const nftMarketplace = await hre.upgrades.deployProxy(NFTMarketplace);
    await nftMarketplace.deployed();
    debug("nftMarketplace deployed to:", nftMarketplace.address);

    fs.writeFileSync('./config.js', `
        export const marketplaceAddress = "${nftMarketplace.address}"
    `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    debug(error);
    process.exit(1);
  });
