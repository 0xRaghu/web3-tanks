const express = require("express");
const router = express.Router();
const tankController = require("../controllers/tankController");

// GET a tank by ID
router.get("/:id", tankController.getTankById);

module.exports = router;
