const dotenv = require("dotenv");
dotenv.config();

const ethers = require("ethers");
const { abi } = require("../artifacts/contracts/Tanks.sol/Tanks.json");
const TanksAddress = "0x8f6b7272ebff7905292D7D674490f3261A623ad2";
const provider = new ethers.providers.JsonRpcProvider(
  `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const tanksContract = new ethers.Contract(TanksAddress, abi, signer);

async function main() {
  await tanksContract.setTankParams(1, 1, 80, 6, 5, 9);
  await tanksContract.setTankParams(2, 1, 70, 8, 8, 7);
  console.log("done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
