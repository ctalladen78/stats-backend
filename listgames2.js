import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  try {
    const params = {
      TableName: process.env.tablePlayer,
      KeyConditionExpression: "playerId = :playerId",
      ExpressionAttributeValues: {
        ":playerId": event.requestContext.identity.cognitoIdentityId
      },
    };
    const result = await dynamoDbLib.call("query", params);
    const paramsGetGame = {
      TableName: process.env.tableHistory,
      KeyConditionExpression: "gameId = :gameId",
      ExpressionAttributeValues: {
        ":gameId": result.Item.gameId
      },
    };
    const r = await dynamoDbLib.call("query", paramsGetGame);
    // Return the matching list of items in response body
    return success(r.Items);
  } catch (e) {
    return failure({ status: false });
  }
}