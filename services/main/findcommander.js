import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  event = event.pathParameters.id.replace("%20", " ");
  console.log(event);
  const params = {
    TableName: process.env.commanderProfile,
    KeyConditionExpression: "commanderId = :commanderId, factionId = :factionId ",
    ExpressionAttributeValues: {
        ":commanderId": event[1],
        ":factionId": event[0],
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