const express = require("express");
const router = express.Router();
const mapController = require("../controllers/mapController");

// Route to get map data
router.get("/:map_id", mapController.getMapById);

module.exports = router;
