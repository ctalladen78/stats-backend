import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

//calculates result from passed in vps
const calculateGameResult = (vp1, vp2, destroyed1, destroyed2) => {
  var gameResult = "draw";
  const vpResult = vp1-vp2;
  if ((vpResult > 4 && !destroyed2) || destroyed1) {
      gameResult = "player 1 crushing win";
  }
  if ((vpResult == 3 || vpResult == 4) && !destroyed1 && !destroyed2) {
      gameResult = "player 1 major win";
  }
  if ((vpResult == 1 || vpResult == 2) && !destroyed1 && !destroyed2) {
      gameResult = "player 1 minor win";
  }
  if ((vpResult < (-4) && !destroyed1) || destroyed2) {
      gameResult = "player 2 crushing win";
  }
  if ((vpResult == -1 || vpResult == -2) && !destroyed1 && !destroyed2) {
      gameResult = "player 2 minor win";
  }
  if ((vpResult == -3 || vpResult == -4) && !destroyed1 && !destroyed2) {
      gameResult = "player 2 major win";
  }

  return (gameResult);
};

// calculate rankings changes and gives out an array
const calculatePlayerRanking = (playerRanking1, playerRanking2, factionRanking1, factionRanking2, gameResult) => {
    const ranking1 = Math.pow(10, (playerRanking1 + factionRanking1)/400);
    const ranking2 = Math.pow(10, (playerRanking2 + factionRanking2)/400);

    const winChance = ranking1/(ranking1 + ranking2);

    const kFactor = 50;
    const kFaction = 10;
    var rankingChange = 0;
    var factionChange = 0;

    if (gameResult == "player 1 minor win") {
        rankingChange = kFactor*(1 - winChance)*0.5;
        factionChange = kFaction*(1 - winChance)*0.5;
    }
    if (gameResult == "player 1 major win") {
        rankingChange = kFactor*(1 - winChance)*0.75;
        factionChange = kFaction*(1 - winChance)*0.75;
        console.log("player 1 major win")
    }
    if (gameResult == "player 1 crushing win") {
        rankingChange = kFactor*(1 - winChance);
        factionChange = kFaction*(1 - winChance);
    }
    if (gameResult == "player 2 minor win") {
        rankingChange = kFactor*(winChance)*0.5*-1;
        factionChange = kFaction*(winChance)*0.5*-1;
    }
    if (gameResult == "player 2 major win") {
        rankingChange = kFactor*(winChance)*0.75*-1;
        factionChange = kFaction*(winChance)*0.75*-1;
    }
    if (gameResult == "player 2 crushing win") {
        rankingChange = kFactor*(winChance)*-1;
        factionChange = kFaction*(winChance)*-1;
    }
    else {
      rankingChange = 0;
      factionChange = 0;
      console.log("its a draw?")
    }

    console.log(rankingChange);
    console.log(factionChange);
    console.log(gameResult);

    return ([rankingChange, factionChange]);
};

const findGame = (gameId) => {
  const params = {
    TableName: process.env.tableHistory,
    Key: {
      gameId: gameId
    }
  };
  return params;
};

//Calls db based upon player Id passed in
const findPlayerRank = (player) => {
  const params = {
    TableName: process.env.playerProfile,
    Key: {
      playerId: player
    }
  };
  return params;
};

const findFactionRank = (faction) => {
  const params = {
    TableName: process.env.factionProfile,
    Key: {
      factionId: faction
    }
  };
  return params;
};

const findCommanderRank = (commander, faction) => {
  const params = {
    TableName: process.env.commanderProfile,
    Key: {
      commanderId: commander,
      factionId: faction
    }
  };
  return params;
};

const updateGameHistory = (gameId, ranking) => {
  const params = {
    TableName: process.env.tableHistory,
    Key: {
      gameId: gameId,
    },
    UpdateExpression: "SET ranking = :ranking",
    ExpressionAttributeValues: {
      ":ranking": ranking, //this needs to come from playerRanksArray
    },
    ReturnValues: "ALL_NEW"
  };
  return params;
};

 const updatePlayerRanks = (player, ranking) => {
  const params = {
    TableName: process.env.playerProfile,
    Key: {
      playerId: player,
    },
    UpdateExpression: "SET ranking = :ranking",
    ExpressionAttributeValues: {
      ":ranking": ranking, //this needs to come from playerRanksArray
    },
    ReturnValues: "ALL_NEW"
  };
  return params;
};
const updateFactionRanks = (faction, ranking) => {
  const params = {
    TableName: process.env.factionProfile,
    Key: {
      factionId: faction,
    },
    UpdateExpression: "SET ranking = :ranking",
    ExpressionAttributeValues: {
      ":ranking": ranking,
    },
    ReturnValues: "ALL_NEW"
  };
  return params;
};

const updateCommanderRanks = (commander, faction, ranking) => {
  const params = {
    TableName: process.env.commanderProfile,
    Key: {
      commanderId: commander,
      factionId: faction,
    },
    UpdateExpression: "SET ranking = :ranking",
    ExpressionAttributeValues: {
      ":ranking": ranking,
    },
    ReturnValues: "ALL_NEW"
  };
  return params;
};

export async function main(event) {
  console.log(event);
  try {
    const gameData = await dynamoDbLib.call("get", findGame(event.pathParameters.id)); //call game data
    console.log(gameData);
    const gameResult = calculateGameResult(gameData.Item.vp1, gameData.Item.vp2, gameData.Item.destroyed1, gameData.Item.destroyed2);
    console.log(gameResult);
    const player1Profile = await dynamoDbLib.call("get", findPlayerRank(gameData.Item.player1)); // call player 1 data from table
    console.log(player1Profile);
    const player2Profile = await dynamoDbLib.call("get", findPlayerRank(gameData.Item.player2)); // call player 2 data from table
    console.log(player2Profile);
    const faction1Profile = await dynamoDbLib.call("get", findFactionRank(gameData.Item.faction1));  // call faction 1 data from table
    console.log(faction1Profile);
    const faction2Profile = await dynamoDbLib.call("get", findFactionRank(gameData.Item.faction2));  // call faction 2 data from table
    console.log(faction2Profile);
    const commander1Profile = await dynamoDbLib.call("get", findCommanderRank(gameData.Item.commander1, gameData.Item.faction1));  // call faction 1 data from table
    console.log(commander1Profile);
    const commander2Profile = await dynamoDbLib.call("get", findCommanderRank(gameData.Item.commander2, gameData.Item.faction2));  // call faction 2 data from table
    console.log(commander2Profile);
    const rankingChanges = calculatePlayerRanking(player1Profile.Item.ranking, player2Profile.Item.ranking, faction1Profile.Item.ranking, faction2Profile.Item.ranking, gameResult);
    console.log(rankingChanges);
    // insert into databases
    const params = {
      TableName: process.env.tableHistory,
      Key: {
        gameId: event.pathParameters.id,
      },
      UpdateExpression: "SET gameResult = :gameResult",
      ExpressionAttributeValues: {
          ":gameResult": gameResult,
        },
        ReturnValues: "ALL_NEW"
      };

      await dynamoDbLib.call("update", params);
      await dynamoDbLib.call("update", updatePlayerRanks(gameData.Item.player1, player1Profile.Item.ranking + rankingChanges[0]));
      await dynamoDbLib.call("update", updatePlayerRanks(gameData.Item.player2, player2Profile.Item.ranking - rankingChanges[0]));
      if (gameData.Item.faction1 != gameData.Item.faction2){
        await dynamoDbLib.call("update", updateFactionRanks(gameData.Item.faction1, faction1Profile.Item.ranking + rankingChanges[1]));
        await dynamoDbLib.call("update", updateFactionRanks(gameData.Item.faction2, faction2Profile.Item.ranking - rankingChanges[1]));
      }
      if (gameData.Item.commander1 != gameData.Item.commander2){
        await dynamoDbLib.call("update", updateCommanderRanks(gameData.Item.commander1, gameData.Item.faction1, commander1Profile.Item.ranking + rankingChanges[1]));
        await dynamoDbLib.call("update", updateCommanderRanks(gameData.Item.commander2, gameData.Item.faction2, commander2Profile.Item.ranking - rankingChanges[1]));
      }
      await dynamoDbLib.call("update", updateGameHistory(event.pathParameters.id, rankingChanges[0]));
    return success(true);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}