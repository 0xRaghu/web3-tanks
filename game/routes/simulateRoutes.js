const express = require("express");
const router = express.Router();
const simulateController = require("../controllers/simulateController");

// POST request to simulate a battle
router.post("/", simulateController.simulateBattle);

module.exports = router;
