const { tanksContract } = require("../utils/contracts");

// GET /api/v1/tanks/:id
exports.getTankById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tank = await tanksContract.getTankParams(id);
    console.log(tank);
    if (!tank) {
      return res.status(404).json({
        success: false,
        message: `Tank with ID ${id} not found`,
      });
    }
    res.status(200).json({
      success: true,
      data: tank,
    });
  } catch (error) {
    next(error);
  }
};
