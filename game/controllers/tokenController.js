const { rewardsContract } = require("../utils/contracts");

// GET /api/v1/token/:add  Retrieves the ERC-20 balance of a given address
exports.getTokenBalance = async (req, res, next) => {
  try {
    const { add } = req.params;
    const balance = await rewardsContract.balanceOf(add);
    if (!balance) {
      return res.status(404).json({
        success: false,
        message: `Address ${add} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: balance.toString(),
    });
  } catch (error) {
    next(error);
  }
};
