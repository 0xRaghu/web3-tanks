const simulateService = require("../services/simulateService");

// POST /api/v1/simulate/ Simulates a game between two tanks
exports.simulateBattle = async (req, res) => {
  try {
    const { tanks, mapid } = req.body;
    const score = await simulateService.simulateBattle(tanks, mapid);
    res.json(score);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
