# Web3 Tanks Game

This project is a web3 game using Tank NFTs to battle against each other to win ERC-20 tokens

Compile contracts:

```shell
npm run compile
```

Test contracts:

```shell
npm run test
```

Goerli Contracts:

```shell
Tanks: 0x8f6b7272ebff7905292D7D674490f3261A623ad2
Game Reward: 0x49D557A5aF215d79Af103322CD5CBe3429C0C2Ab
```

API Endpoints:

```shell
GET /api/v1/map/:map_id: Retrieves a map by its ID.
GET /api/v1/metadata/:tank_id: Retrieves metadata of a tank by its ID.
GET /api/v1/score/:score_id: Retrieves a score by its ID.
POST /api/v1/simulate/ Simulates a game between two tanks
GET /api/v1/tanks/:id
GET /api/v1/token/:add  Retrieves the ERC-20 balance of a given address
```

Sample ENV file:

```shell
PRIVATE_KEY=""
LOCAL_PRIVATE_KEY=""
INFURA_PROJECT_ID=""
```
