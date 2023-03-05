const metadataDB = require("../db/metadata.json");

// GET /api/v1/metadata/:tank_id: Retrieves metadata of a tank by its ID.
exports.getMetadataById = async (req, res) => {
  try {
    const metadata = metadataDB[req.params.tank_id];
    if (!metadata) {
      return res.status(404).json({ message: "Metadata not found" });
    }
    res.json(metadata);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
