const express = require("express");
const router = express.Router();
const metadataController = require("../controllers/metadataController");

// Route to get meta data
router.get("/:tank_id", metadataController.getMetadataById);

module.exports = router;
