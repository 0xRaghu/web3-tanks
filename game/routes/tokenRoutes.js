const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");

// GET the balance by address
router.get("/:add", tokenController.getTokenBalance);

module.exports = router;
