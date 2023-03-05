const express = require("express");
const router = express.Router();

// Score table data stored in memory
let scoreTable = require("../db/scoreData.json");

// Endpoint to display battle score in JSON format
// GET /api/v1/score/:score_id: Retrieves a score by its ID.
exports.getBattleScore = async (req, res) => {
  const scoreId = req.params.score_id;
  const score = scoreTable[scoreId];

  if (!score) {
    res.status(404).json({ error: "Score not found" });
  } else {
    res.json(score);
  }
};
