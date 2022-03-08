const ethers = require("ethers");
const fs = require('fs');
const hre = require("hardhat");
const debug = require('debug')("mint:");
debug.color = "158";
debug.enabled = true;
const { marketplaceAddress } = require("../config");

async function main() {
    const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketPlace");
    const nftMarketplace = await NFTMarketplace.attach(marketplaceAddress);
    const gasCostPerMint = 125000;
    const toMint = 980;
    const batchMint = 100;
    let i = toMint;

    try {
        for(; i > 0; i -= batchMint) {
            const maxMint = (i < batchMint) ? i : batchMint;
            debug(`Trying to mint ${maxMint} with gasLimit ${gasCostPerMint * maxMint}`);
            const tx = await nftMarketplace.mintTokens("", maxMint, {gasLimit: (gasCostPerMint * maxMint)});
            const receipt = await tx.wait();
            debug(receipt.log);
        }
    } catch (e) {
        debug(e);
        debug(`Minted ${toMint - i} of ${toMint}`);

    }

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        debug(error);
        process.exit(1);
    });
