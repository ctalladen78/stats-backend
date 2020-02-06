import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
  event = event.pathParameters.id;
  const params = {
    TableName: process.env.tournamentPlayers,
    FilterExpression: "tournamentId = :tournamentId",
    ExpressionAttributeValues: {
        ":tournamentId": event
    },
  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}