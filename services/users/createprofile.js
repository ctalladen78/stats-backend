import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.playerProfile,
    Item: {
      playerId: event.requestContext.identity.cognitoIdentityId,
      firstName: data.firstName,
      secondName: data.secondName,
      userName: data.userName,
      ranking: 1500,
      newRegion: data.region,
      country: data.country,
      version: 2,
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}