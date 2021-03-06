import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event) {
  const data = event.pathParameters.id;

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

  try {
    const gameData = await dynamoDbLib.call("get", findGame(data)); //call game data
    console.log(gameData);
    const player1Profile = await dynamoDbLib.call("get", findPlayerRank(gameData.Item.player1)); // call player 1 data from table
    const player2Profile = await dynamoDbLib.call("get", findPlayerRank(gameData.Item.player2)); // call player 2 data from table
    const faction1Profile = await dynamoDbLib.call("get", findFactionRank(gameData.Item.faction1));  // call faction 1 data from table
    const faction2Profile = await dynamoDbLib.call("get", findFactionRank(gameData.Item.faction2));  // call faction 2 data from table
    const commander1Profile = await dynamoDbLib.call("get", findCommanderRank(gameData.Item.commander1, gameData.Item.faction1));  // call faction 1 data from table
    const commander2Profile = await dynamoDbLib.call("get", findCommanderRank(gameData.Item.commander2, gameData.Item.faction2));  // call faction 2 data from table
    if (gameData.Item.ranking !== undefined){
      if (gameData.Item.ranked !== "unranked") {
        await dynamoDbLib.call("update", updatePlayerRanks(gameData.Item.player1, (player1Profile.Item.ranking - gameData.Item.ranking)));
        await dynamoDbLib.call("update", updatePlayerRanks(gameData.Item.player2, (player2Profile.Item.ranking + gameData.Item.ranking)));
      }
      if (gameData.Item.faction1 != gameData.Item.faction2){
        await dynamoDbLib.call("update", updateFactionRanks(gameData.Item.faction1, (faction1Profile.Item.ranking - (gameData.Item.ranking*0.1))));
        await dynamoDbLib.call("update", updateFactionRanks(gameData.Item.faction2, (faction2Profile.Item.ranking + (gameData.Item.ranking*0.1))));
      }
      if (gameData.Item.commander1 != gameData.Item.commander2){
        await dynamoDbLib.call("update", updateCommanderRanks(gameData.Item.commander1, gameData.Item.faction1, (commander1Profile.Item.ranking - (gameData.Item.ranking*0.1))));
        await dynamoDbLib.call("update", updateCommanderRanks(gameData.Item.commander2, gameData.Item.faction2, (commander2Profile.Item.ranking + (gameData.Item.ranking*0.1))));
      }
    }


    const params = {
      TableName: process.env.tableHistory,
      Key: {
        gameId: data
      }
    };

    const params2 = {
      TableName: process.env.tablePlayer,
      Key: {
        gameId: data,
        playerId: gameData.Item.player1,
        }
    };

    const params3 = {
      TableName: process.env.tablePlayer,
      Key: {
          gameId: data,
        playerId: gameData.Item.player2,
        }
    };

    const params4 = {
      TableName: process.env.tableFaction,
      Key: {
          gameId: data,
        factionId: gameData.Item.faction1,
        }
    };

    const params5 = {
      TableName: process.env.tableFaction,
      Key: {
          gameId: data,
        factionId: gameData.Item.faction2,
        }
    };

    const params6 = {
      TableName: process.env.tableCommander,
      Key: {
          gameId: data,
        commanderId: gameData.Item.commander1,
        }
    };

    const params7 = {
      TableName: process.env.tableCommander,
      Key: {
          gameId: data,
        commanderId: gameData.Item.commander2,
        }
    };

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