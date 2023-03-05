const SCORE_DATA_PATH = "./db/scoreData.json";

// Save score data
function saveScoreData(scoreData) {
  const currentScoreData = JSON.parse(fs.readFileSync(SCORE_DATA_PATH));
  currentScoreData.push(scoreData);
  fs.writeFileSync(SCORE_DATA_PATH, JSON.stringify(currentScoreData, null, 2));
}

// Get score data
function getScoreData(scoreId) {
  const scoreData = JSON.parse(fs.readFileSync(SCORE_DATA_PATH));
  const score = scoreData[scoreId];
  if (!score) {
    throw new Error(`Score with id ${scoreId} not found`);
  }
  return score;
}

module.exports = {
  saveScoreData,
  getScoreData,
};
