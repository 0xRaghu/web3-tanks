const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");

// Route to get battle score
router.get("/:score_id", scoreController.getBattleScore);

module.exports = router;
