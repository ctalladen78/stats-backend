import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.playerProfile,
    Item: {
      playerId: event.requestContext.identity.cognitoIdentityId,
      playerName: data.playerName,
      userName: data.userName,
      region: data.region,
      country: data.country,
    }
  };

  try {
    await dynamoDbLib.call("update", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}