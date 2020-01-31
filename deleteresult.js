import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


export async function main(event) {
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.tableHistory,
    Key: {
      gameId: data.gameId,
    }
  };

  console.log(params);

  const params2 = {
    TableName: process.env.tablePlayer,
    Key: {
      gameId: data.gameId,
      playerId: data.player1,
      }
  };

  const params3 = {
    TableName: process.env.tablePlayer,
    Key: {
        gameId: data.gameId,
      playerId: data.player2,
      }
  };

  const params4 = {
    TableName: process.env.tableFaction,
    Key: {
        gameId: data.gameId,
      factionId: data.faction1,
      }
  };

  const params5 = {
    TableName: process.env.tableFaction,
    Key: {
        gameId: data.gameId,
      factionId: data.faction2,
      }
  };

  const params6 = {
    TableName: process.env.tableCommander,
    Key: {
        gameId: data.gameId,
      commanderId: data.commander1,
      }
  };

  const params7 = {
    TableName: process.env.tableCommander,
    Key: {
        gameId: data.gameId,
      commanderId: data.commander2,
      }
  };

  try {
    const gameData = await dynamoDbLib.call("get", findGame(event.pathParameters.id)); //call game data
    console.log(gameData);
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
    // await dynamoDbLib.call("delete", params);
    // await dynamoDbLib.call("delete", params2);
    // await dynamoDbLib.call("delete", params3);
    // await dynamoDbLib.call("delete", params4);
    // await dynamoDbLib.call("delete", params5);
    // await dynamoDbLib.call("delete", params6);
    // await dynamoDbLib.call("delete", params7);
    return success(data.gameId);
  } catch (e) {
    return failure({ status: e });
  }
}