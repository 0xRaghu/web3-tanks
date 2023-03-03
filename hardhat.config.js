require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");
const dotenv = require("dotenv");
require("hardhat-docgen");
dotenv.config();

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    gasPrice: 21,
    url: `http://127.0.0.1:8545`,
  },
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  docgen: {
    path: "./docs",
    clear: true,
    runOnCompile: true,
  },
};
