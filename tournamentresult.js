import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, result) {
    console.log(event);
    console.log(result);

    const data = JSON.parse(event.body);

    const params = {
      TableName: process.env.tournamentGames,
      Item: {
        gameId: data.gameId,
        tournamentId: data.tournamentId,
        resultSubmitted: true,
      }
    };
    console.log(params);

    try{
      await dynamoDbLib.call("update", params);
    return success(true);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}