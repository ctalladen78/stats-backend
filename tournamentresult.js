import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
    console.log(event);

    const params = {
      TableName: process.env.tournamentGames,
      Key: {
        gameId: event.pathParameters.id,
      },
      UpdateExpression: "SET resultSubmitted = :resultSubmitted",
      ExpressionAttributeValues: {
          ":resultSubmitted": true,
        },
        ReturnValues: "ALL_NEW"
      };

    try{
      await dynamoDbLib.call("update", params);
    return success(true);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}