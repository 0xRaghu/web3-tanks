const { tanksContract } = require("../utils/contracts");

// Get tank by id
async function getTank(tokenId) {
  const tank = await tanksContract.getTankParams(tokenId);
  console.log(tank);
  return tank;
}

module.exports = {
  getTank,
};
