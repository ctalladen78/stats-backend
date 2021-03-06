import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  console.log(event);
  const params = {
    TableName: process.env.playerProfile,
    KeyConditionExpression: "playerId = :playerId",
    ExpressionAttributeValues: {
      ":playerId": event.requestContext.identity.cognitoIdentityId
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}