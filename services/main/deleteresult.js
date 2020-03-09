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

  try {
    const gameData = await dynamoDbLib.call("get", findGame(data)); //call game data
    console.log(gameData);

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