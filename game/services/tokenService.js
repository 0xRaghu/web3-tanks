const { rewardsContract } = require("../utils/contracts");

// Get balance by address
async function getBalance(tokenId) {
  const balance = await rewardsContract.balanceOf(tokenId);
  return balance.toString();
}

module.exports = {
  getBalance,
};
