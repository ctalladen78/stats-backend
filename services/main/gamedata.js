import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  const params = {
    TableName: process.env.tableHistory,
    KeyConditionExpression: "gameId = :gameId",
    ExpressionAttributeValues: {
      ":gameId": event.gameId
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ e });
  }
}