// Import required packages and files
const pathfinding = require("pathfinding");
const { BigNumber } = require("ethers");
const fs = require("fs");
const path = require("path");

// Import map and metadata from JSON files
const mapDB = require("../db/mapData.json");
const metadataDB = require("../db/metadata.json");
// Define data directory and path to score database
const dataDirectory = path.join(__dirname, "..", "db");
const scoreDB = path.join(dataDirectory, "scoreData.json");

// Import contracts from utils;
const { tanksContract, rewardsContract } = require("../utils/contracts");

// Define function to simulate a battle between two tanks
const simulateBattle = async (tanks) => {
  // Retrieve parameters and owner for each tank
  const tank1NFT = await tanksContract.getTankParams(tanks[0]);
  const tank2NFT = await tanksContract.getTankParams(tanks[1]);
  const tank1Owner = await tanksContract.ownerOf(tanks[0]);
  const tank2Owner = await tanksContract.ownerOf(tanks[1]);

  // Set reward for battle
  const rewardTokens = "50";
  const rewardAmount = BigNumber.from(rewardTokens).mul(
    BigNumber.from("10").pow(18)
  );

  // Check if tank IDs are valid
  if (!tank1NFT || !tank2NFT) {
    throw new Error("Invalid tank IDs provided");
  }
  // Retrieve metadata for each tank
  const tank1Metadata = metadataDB[tanks[0]];
  const tank2Metadata = metadataDB[tanks[1]];

  // Retrieve map data
  const mapData = mapDB.maps[0];

  // Initialize map
  const grid = new pathfinding.Grid(mapData.width, mapData.height);
  for (let x = 0; x < mapData.width; x++) {
    for (let y = 0; y < mapData.height; y++) {
      grid.setWalkableAt(x, y, true);
    }
  }

  // Initialize pathfinder
  const finder = new pathfinding.AStarFinder({
    diagonalMovement: pathfinding.DiagonalMovement.Always,
  });

  // Set tank positions
  const tank1 = {
    health: tank1NFT.health,
    speed: tank1NFT.speed,
    defense: tank1NFT.defense,
    power: tank1NFT.power,
    position: { x: 0, y: 0 },
  };
  const tank2 = {
    health: tank2NFT.health,
    speed: tank2NFT.speed,
    defense: tank2NFT.defense,
    power: tank2NFT.power,
    position: { x: 0, y: 0 },
  };
  tank1.position.x = setRandomPosition(grid, 1)[0];
  tank1.position.y = setRandomPosition(grid, 1)[1];
  tank2.position.x = setRandomPosition(grid, 2)[0];
  tank2.position.y = setRandomPosition(grid, 2)[1];

  // Print starting positions and metadata for each tank
  console.log("Tank 1:");
  console.log("- Health:", tank1.health);
  console.log("- Speed:", tank1.speed);
  console.log("- Defense:", tank1.defense);
  console.log("- Power:", tank1.power);
  console.log(
    `- Starting Position: (${tank1.position.x},${tank1.position.y})\n`
  );
  console.log("Tank 1 Metadata:");
  for (const key in tank1Metadata) {
    const value = tank1Metadata[key];
    console.log(`\t${key}: ${value}`);
  }
  console.log("\n");
  console.log("Tank 2:");
  console.log("- Health:", tank2.health);
  console.log("- Speed:", tank2.speed);
  console.log("- Defense:", tank2.defense);
  console.log("- Power:", tank2.power);
  console.log(
    `- Starting Position: (${tank2.position.x},${tank2.position.y})\n`
  );
  console.log("Tank 2 Metadata:");
  for (const key in tank2Metadata) {
    const value = tank2Metadata[key];
    console.log(`\t${key}: ${value}`);
  }
  console.log("\n");

  // Simulate battle
  let winner = null;
  let turn = 1;
  // timer to add a delay between rounds
  const timer = (ms) => new Promise((res) => setTimeout(res, ms));
  while (!winner) {
    console.log(`\nTurn ${turn}`);
    console.log(
      `\tTank 1 moves to: (${tank1.position.x}, ${tank1.position.y})`
    );
    console.log(
      `\tTank 2 moves to: (${tank2.position.x}, ${tank2.position.y})`
    );

    // Find path to opponent
    const pathToOpponent1 = finder.findPath(
      tank1.position.x,
      tank1.position.y,
      tank2.position.x,
      tank2.position.y,
      grid.clone()
    );
    const pathToOpponent2 = finder.findPath(
      tank2.position.x,
      tank2.position.y,
      tank1.position.x,
      tank1.position.y,
      grid.clone()
    );

    // Move tanks towards each other
    if (pathToOpponent1.length > tank1.speed) {
      tank1.position.x = pathToOpponent1[tank1.speed][0];
      tank1.position.y = pathToOpponent1[tank1.speed][1];
    }
    if (pathToOpponent2.length > tank2.speed) {
      tank2.position.x = pathToOpponent2[tank2.speed][0];
      tank2.position.y = pathToOpponent2[tank2.speed][1];
    }

    // Check if tanks are within firing range
    if (isInFiringRange(tank1, tank2)) {
      const damage = calculateDamage(tank1, tank2);
      tank2.health = Math.max(tank2.health - damage, 0);
      console.log(`Tank 1 attacks Tank 2! Tank 2's health: ${tank2.health}`);
      if (tank2.health <= 0) {
        winner = tank1;
        console.log(
          `\nTank 1 Wins with a health of ${tank1.health} at position (${tank1.position.x},${tank1.position.y})!`
        );
        // Increment XP
        await tanksContract.incrementXP(tanks[0]);
        console.log(`XP incremented for Tank 1 with ID ${tanks[0]}`);
        // Reward with ERC-20 tokens
        await rewardsContract.transfer(tank1Owner, rewardAmount);
        console.log(
          `Owner of Tank 1: ${tank1Owner} rewarded with ${rewardTokens} Web3Tanks Tokens`
        );
        // Increase score of winner
        let scores = JSON.parse(fs.readFileSync(scoreDB));
        scores[tanks[0]] = scores[tanks[0]] ? scores[tanks[0]] + 1 : 1;
        fs.writeFileSync(scoreDB, JSON.stringify(scores));
        console.log(
          `Score of Tank 1 with ID ${tanks[0]} increased by 1, New Score: ${
            scores[tanks[0]]
          }`
        );
        break;
      }
    }
    if (isInFiringRange(tank2, tank1)) {
      const damage = calculateDamage(tank2, tank1);
      tank1.health = Math.max(tank1.health - damage, 0);
      console.log(`Tank 2 attacks Tank 1! Tank 1's health: ${tank1.health}`);
      if (tank1.health <= 0) {
        winner = tank2;
        console.log(
          `\nTank 2 Wins with a health of ${tank2.health} at position (${tank2.position.x},${tank2.position.y})!`
        );
        // Increment XP
        await tanksContract.incrementXP(tanks[1]);
        console.log(`XP incremented for Tank 2 with ID ${tanks[1]}`);
        // Reward with ERC-20 tokens
        await rewardsContract.transfer(tank2Owner, rewardAmount);
        console.log(
          `Owner of Tank 2: ${tank2Owner} rewarded with ${rewardTokens} Web3Tanks Tokens`
        );
        // Increase score of winner
        let scores = JSON.parse(fs.readFileSync(scoreDB));
        scores[tanks[1]] = scores[tanks[1]] ? scores[tanks[1]] + 1 : 1;
        fs.writeFileSync(scoreDB, JSON.stringify(scores));
        console.log(
          `Score of Tank 2 with ID ${tanks[1]} increased by 1, New Score: ${
            scores[tanks[1]]
          }`
        );
        break;
      }
    }

    turn++;
    await timer(500);
  }

  // Return winner
  return winner;
};

function setRandomPosition(grid, id) {
  // Find a random empty position on the grid
  let emptyPositions = [];
  for (let i = 0; i < grid.nodes.length; i++) {
    for (let j = 0; j < grid.nodes[i].length; j++) {
      if (grid.nodes[i][j].walkable) {
        emptyPositions.push([i, j]);
      }
    }
  }
  if (emptyPositions.length === 0) {
    throw new Error("No empty position found on the grid");
  }
  let randomIndex = Math.floor(Math.random() * emptyPositions.length);
  let position = emptyPositions[randomIndex];
  grid.setWalkableAt(position[0], position[1], false);
  return position;
}

function isInFiringRange(source, target) {
  const dx = source.position.x - target.position.x;
  const dy = source.position.y - target.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance <= source.speed;
}

function calculateDamage(attacker, defender) {
  const baseDamage = attacker.power * 2;
  const damage = (baseDamage * (10 - defender.defense)) / 10;
  return Math.floor(damage);
}

module.exports = { simulateBattle };
