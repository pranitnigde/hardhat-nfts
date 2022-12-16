const { assert } = require("chai");
const { network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)   
    ? discribe.skip 
    : describe("Basic Nft Unit Test", () => {
        let deployer,accounts, basicNft;
        beforeEach(async () => {
            accounts = await ethers.getSigners();
            deployer = accounts[0];
            await deployments.fixture(["basicnft"]);
            basicNft = await ethers.getContract("BasicNft");
        });

        describe("Constructor", () => {
            it("Initialize Contract correctly!", async () => {
                assert(basicNft.name, "DoggiNFT");
                assert(basicNft.symbol, "DNFT");
                assert(basicNft.getTokenId(), 0);
            });
        });

        describe('mintNft', () => { 
            beforeEach(async () => {
                const transactionRecipt = await basicNft.mintNft();
                transactionRecipt.wait(3);
            });
            it("Allows User to mint NFT, Token Id and url set properly", async () => {
                const tokenId = await basicNft.getTokenId();
                const nftUrl = await basicNft.tokenURI(0);

                assert( tokenId, "1" );
                assert( nftUrl, "https://ipfs.io/ipfs/QmZuEvdfbR59sWvRmXNDaeMfHSUTfQoHhWsCX6bGKhsLTS?filename=doggyNft.metadata.json");
            });
            it("show correct balance and owner of Nft", () => {
                assert(basicNft.ownerOf("0"), deployer);
                assert(basicNft .balanceOf(deployer), "1");
            });
        });
    });