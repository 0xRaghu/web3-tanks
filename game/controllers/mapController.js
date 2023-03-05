const mapDB = require("../db/mapData.json");

// GET /api/v1/map/:map_id: Retrieves a map by its ID.
exports.getMapById = async (req, res) => {
  try {
    const mapData = mapDB.maps[req.params.map_id - 1];
    if (!mapData) {
      return res.status(404).json({ message: "Map not found" });
    }
    res.json(mapData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
