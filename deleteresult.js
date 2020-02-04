import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


export async function main(event) {
  const data = event.pathParameters.id;

  console.log(data);

  const findGame = (gameId) => {
    console.log(gameId);
    const params = {
      TableName: process.env.tableHistory,
      Key: {
        gameId: gameId
      }
    };
    console.log(params);
    return params;
  };

  //Calls db based upon player Id passed in
  const findPlayerRank = (player) => {
    console.log(player);
    const params = {
      TableName: process.env.playerProfile,
      Key: {
        playerId: player
      }
    };
    console.log(params);
    return params;
  };

  const findFactionRank = (faction) => {
    const params = {
      TableName: process.env.factionProfile,
      Key: {
        factionId: faction
      }
    };
    console.log(params);
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
    console.log(params);
    return params;
  };

   const updatePlayerRanks = (player, ranking) => {
    console.log(player);
    console.log(ranking);
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

  try {
    const gameData = await dynamoDbLib.call("get", findGame(data)); //call game data
    console.log(gameData);
    console.log(gameData.Item.player1);
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

    await dynamoDbLib.call("update", updatePlayerRanks(gameData.Item.player1, player1Profile.Item.ranking + gameData.Item.result));
    await dynamoDbLib.call("update", updatePlayerRanks(gameData.Item.player2, player2Profile.Item.ranking - gameData.Item.result));
    if (gameData.Item.faction1 != gameData.Item.faction2){
      await dynamoDbLib.call("update", updateFactionRanks(gameData.Item.faction1, faction1Profile.Item.ranking + (gameData.Item.result*0.2)));
      await dynamoDbLib.call("update", updateFactionRanks(gameData.Item.faction2, faction2Profile.Item.ranking - (gameData.Item.result*0.2)));
    }
    if (gameData.Item.commander1 != gameData.Item.commander2){
      await dynamoDbLib.call("update", updateCommanderRanks(gameData.Item.commander1, gameData.Item.faction1, commander1Profile.Item.ranking + (gameData.result*0.2)));
      await dynamoDbLib.call("update", updateCommanderRanks(gameData.Item.commander2, gameData.Item.faction2, commander2Profile.Item.ranking - (gameData.result*0.2)));
    }

    const params = {
      TableName: process.env.tableHistory,
      Key: {
        gameId: data
      }
    };
    console.log(params);

    const params2 = {
      TableName: process.env.tablePlayer,
      Key: {
        gameId: data,
        playerId: player1Profile.Item.playerId,
        }
    };
    console.log(params2);

    const params3 = {
      TableName: process.env.tablePlayer,
      Key: {
          gameId: data,
        playerId: player2Profile.Item.playerId,
        }
    };
    console.log(params3);

    const params4 = {
      TableName: process.env.tableFaction,
      Key: {
          gameId: data,
        factionId: faction1Profile.Item.factionId,
        }
    };
    console.log(params4);

    const params5 = {
      TableName: process.env.tableFaction,
      Key: {
          gameId: data,
        factionId: faction2Profile.Item.factionId,
        }
    };
    console.log(params5);

    const params6 = {
      TableName: process.env.tableCommander,
      Key: {
          gameId: data,
        commanderId: commander1Profile.Item.commanderId,
        }
    };
    console.log(params6);

    const params7 = {
      TableName: process.env.tableCommander,
      Key: {
          gameId: data,
        commanderId: commander2Profile.Item.commanderId,
        }
    };
    console.log(params7);

    await dynamoDbLib.call("delete", params);
    await dynamoDbLib.call("delete", params2);
    await dynamoDbLib.call("delete", params3);
    await dynamoDbLib.call("delete", params4);
    await dynamoDbLib.call("delete", params5);
    await dynamoDbLib.call("delete", params6);
    await dynamoDbLib.call("delete", params7);
    return success(data.gameId);
  } catch (e) {
    console.log(e);
    return failure({ status: e });
  }
}
