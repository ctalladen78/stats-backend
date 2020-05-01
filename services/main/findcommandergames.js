import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  event = event.pathParameters.id.replace("%20", " ");
  const params = {
    TableName: process.env.tableCommander,
    KeyConditionExpression: "commanderId = :commanderId",
    ExpressionAttributeValues: {
      ":commanderId": event
    },
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}