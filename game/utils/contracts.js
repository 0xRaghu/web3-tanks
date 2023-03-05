const dotenv = require("dotenv");
dotenv.config();

const ethers = require("ethers");
const { abi } = require("../../artifacts/contracts/Tanks.sol/Tanks.json");
const {
  abi: rewardsABI,
} = require("../../artifacts/contracts/GameReward.sol/GameReward.json");
const TanksAddress = "0x8f6b7272ebff7905292D7D674490f3261A623ad2";
const RewardsAddress = "0x49D557A5aF215d79Af103322CD5CBe3429C0C2Ab";
const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tanksContract = new ethers.Contract(TanksAddress, abi, signer);
const rewardsContract = new ethers.Contract(RewardsAddress, rewardsABI, signer);

module.exports = {
  tanksContract,
  rewardsContract,
};
