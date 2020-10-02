import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  const params = {
    TableName: process.env.playerProfile,
    Key: {
      playerId: event.requestContext.identity.cognitoIdentityId,
    },
    UpdateExpression: "SET lastLogin = :lastLogin",
    ExpressionAttributeValues: {
      ":lastLogin": Date.now(),
    },
  };

  console.log(params);

  try {
    await dynamoDbLib.call("update", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}