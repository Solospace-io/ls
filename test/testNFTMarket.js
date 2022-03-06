const hre = require("hardhat");
const fs = require('fs');
const debug = require('debug')("NFTMarketPlace:log");
debug.color = "159";
const ethers = hre.ethers;

/* test/testNFTMarket.js */
describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const NFTMarketPlace = await ethers.getContractFactory("NFTMarketPlace")
    const nftMarketplace = await hre.upgrades.deployProxy(NFTMarketPlace);
    await nftMarketplace.deployed()

    let listingPrice = await nftMarketplace.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    const addresses = await ethers.getSigners();
    /* create two tokens, returns bignumber for tokenID */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
    const tokenID1 = await nftMarketplace.getCurrentTokenID();
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })
    const tokenID2 = await nftMarketplace.getCurrentTokenID();

    debug(`Token ID 1: ${tokenID1}`);
    debug(`Token ID 2: ${tokenID2}`);

    /* execute sale of token to another user */
    await nftMarketplace.connect(addresses[1]).createMarketSale(tokenID1, { value: auctionPrice })

    /* resell a token */
    await nftMarketplace.connect(addresses[1]).resellToken(tokenID1, auctionPrice, { value: listingPrice })

    /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    debug('items: ', items)
  })
})
