const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await network.config.chainId;
  let priceFeedAddress;

    if ( developmentChains.includes(network.name) ) {   
        log("getting mocks");
        const mockAggregator = await ethers.getContract("MockV3Aggregator");
        priceFeedAddress = mockAggregator.address;
    } else {
        priceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }

    lowSvg = "";
    highSvg = "";

  log("----------------------------------------------------");
  arguments = [lowSvg, highSvg, priceFeedAddress];
  const randomSvgNft = await deploy("DynamicSvgNft", {
    from: deployer,
    args: arguments,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Verify the deployment
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(randomSvgNft.address, arguments);
  }
};

module.exports.tags = ["all", "dynamicNft", "main"];
