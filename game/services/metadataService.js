const metadataDB = require("../db/metadata.json");

// GET the metadata by id
async function getMetadata(tank_id) {
  const metadata = metadataDB[tank_id];
  console.log(metadataDB);
  return metadata;
}

module.exports = {
  getMetadata,
};
