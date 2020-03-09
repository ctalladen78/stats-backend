import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.playerProfile,
    Key: {
      playerId: event.requestContext.identity.cognitoIdentityId,
    },
    UpdateExpression: "SET firstName = :firstName, secondName = :secondName, userName = :userName, newRegion = :newRegion, country = :country, version = :version",
    ExpressionAttributeValues: {
      ":firstName": data.firstName,
      ":secondName": data.secondName,
      ":userName": data.userName,
      ":newRegion": data.region,
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