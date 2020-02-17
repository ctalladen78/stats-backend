import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
    console.log(event);

    const data = JSON.parse(event.body);
    console.log(data);

    const params = {
      TableName: process.env.tournamentGames,
      Item: {
        gameId: data.gameId,
        tournamentId: data.tournamentId,
        resultSubmitted: true,
      }
    };

    try{
      await dynamoDbLib.call("put", params);
    return success(true);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}