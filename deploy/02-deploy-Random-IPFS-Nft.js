const { network } = require("hardhat")
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify")

const FUND_AMOUNT = "1000000000000000000000";

let tokenUris = [
  "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
  "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
  "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
];

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

    if (developmentChains.includes(network.name)) {
      // create VRFV2 Subscription
      vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
      vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
      const transactionResponse =
        await vrfCoordinatorV2Mock.createSubscription();
      const transactionReceipt = await transactionResponse.wait();
      subscriptionId = transactionReceipt.events[0].args.subId;
      // Fund the subscription
      // Our mock makes it so we don't actually have to worry about sending fund
      await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT);
    } else {
      vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
      subscriptionId = networkConfig[chainId].subscriptionId;
    }

    arguments = [
      subscriptionId,
      vrfCoordinatorV2Address,
      networkConfig[chainId]["gasLane"],
      networkConfig[chainId]["callbackGasLimit"],
      networkConfig[chainId]["mintFee"],
      tokenUris,
    ];

    log("----------------------------------------------------")
    const RandomIpfsNft = await deploy("RandomIpfsNft", {
      from: deployer,
      args: arguments,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (developmentChains.includes(network.name)) {
      await vrfCoordinatorV2Mock.addConsumer(
        subscriptionId,
        RandomIpfsNft.address
      );
    }
  // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(RandomIpfsNft.address, arguments);
    }
}

module.exports.tags = ["all", "RandomIpfsNft", "main"];