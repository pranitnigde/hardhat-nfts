const { network } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");

const BASE_FEE = "250000000000000000";
const GAS_PRICE = 1e9;

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (developmentChains.includes(network.name)) {
    log("----------------------------------------------------");
    arguments = [BASE_FEE, GAS_PRICE];
    await deploy("VRFCoordinatorV2Mock", {
      from: deployer,
      args: arguments,
      log: true,
      waitConfirmations: 1,
    });
    log("deploying v3Aggtregator");
    await deploy("MockV3Aggregator", {
      from: deployer,
      log: true,
      args: [18, "200000000000000000000"],
    });
    log("mocks deployed!");
    log("------------------------------------------------");
  }
};

module.exports.tags = ["all", "mockNft", "RandomIpfsNft"];
