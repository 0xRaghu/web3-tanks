const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Web3 Tanks", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, player1, player2, exchange] = await ethers.getSigners();

    const Tanks = await ethers.getContractFactory("Tanks");
    const tanks = await Tanks.deploy(
      player1.address,
      5,
      owner.address,
      "Web3 Tanks",
      "W3T",
      "https://ipfs.io/Qm1234../",
      owner.address
    );

    const GameReward = await ethers.getContractFactory("GameReward");
    const gameReward = await GameReward.deploy(
      owner.address,
      BigNumber.from("1000000").mul(BigNumber.from("10").pow(18)),
      player1.address,
      "W3Tanks Game Reward",
      "W3T"
    );

    const zeroAddress = "0x0000000000000000000000000000000000000000";

    return {
      tanks,
      owner,
      player1,
      player2,
      exchange,
      gameReward,
      zeroAddress,
    };
  }
  describe("Success Scenarios", function () {
    it("Mints NFTs", async function () {
      const { tanks, zeroAddress } = await loadFixture(deployFixture);

      expect(await tanks.ownerOf(1)).to.not.equal(zeroAddress);
    });

    it("Sets Tank Params", async function () {
      const { tanks } = await loadFixture(deployFixture);

      expect(await tanks.setTankParams(1, 1, 80, 8, 5, 9)).to.emit(
        tanks,
        "TankParamsUpdated"
      );
    });

    it("Fetch Tank Params", async function () {
      const { tanks } = await loadFixture(deployFixture);
      await tanks.setTankParams(1, 1, 80, 8, 5, 9);
      const res = await tanks.getTankParams(1);
      expect(res[5]).to.be.true;
    });

    it("Increments XP", async function () {
      const { tanks } = await loadFixture(deployFixture);
      await tanks.setTankParams(1, 1, 80, 8, 5, 9);
      await tanks.incrementXP(1);
      const res = await tanks.getTankParams(1);
      expect(res[0]).to.equal(2);
    });
  });
  describe("Failure Scenarios", function () {
    it("Reverts for Invalid parameters", async function () {
      const { tanks } = await loadFixture(deployFixture);
      await expect(
        tanks.setTankParams(1, 1, 80, 80, 5, 9)
      ).to.be.revertedWithCustomError(tanks, "InvalidParams");
    });
  });
});
