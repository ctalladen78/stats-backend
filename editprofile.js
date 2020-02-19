import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.playerProfile,
    Key: {
      playerId: event.requestContext.identity.cognitoIdentityId,
    },
    UpdateExpression: "SET playerName = :playerName, userName = :userName, subregion = :region, country = :country, version = :version",
    ExpressionAttributeValues: {
      ":playerName": data.playerName,
      ":userName": data.userName,
      ":region": data.region,
      ":country": data.country,
      ":version": 2,
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