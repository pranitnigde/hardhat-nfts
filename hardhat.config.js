require("@nomicfoundation/hardhat-toolbox");
require('hardhat-deploy');
require("dotenv").config();
require("solidity-coverage");

const GOERLI_RPC_URL = "https://eth-goerli.alchemyapi.io/v2/your-api-key";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",

  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  networks: {
    goerli: {
      url: GOERLI_RPC_URL,
      accounts: [
        "3bbf9654913f4255bed1cd32a9dd074cd33d58d738b26dc8acf2e42ccff53c63",
      ],
      chainId: 5,
      blockConfirmations: 6,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
};
