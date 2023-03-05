// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

async function main() {
  const [admin] = await ethers.getSigners();

  const player = "0x5E83F26578D25C1A59335Cdd427E35089816E7cD";

  const Tanks = await hre.ethers.getContractFactory("Tanks");
  const tanks = await Tanks.deploy(
    player,
    2,
    admin.address,
    "Web3 Tanks",
    "W3T",
    "https://ipfs.io/Qm1234../",
    admin.address
  );

  await tanks.deployed();

  console.log(`Tanks NFT deployed to ${tanks.address}`);

  const Reward = await hre.ethers.getContractFactory("GameReward");
  const reward = await Reward.deploy(
    admin.address,
    BigNumber.from("1000000").mul(BigNumber.from("10").pow(18)),
    player,
    "W3Tanks Game Reward",
    "W3T"
  );

  await reward.deployed();

  console.log(`Game Rewards deployed to ${reward.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
