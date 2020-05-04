import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  event = event.pathParameters.id.replace("%20", " ").replace("%28", "(").replace("%29", ")");
  console.log(event);
  const params = {
    TableName: process.env.commanderProfile,
    KeyConditionExpression: "commanderId = :commanderId",
    ExpressionAttributeValues: {
        ":commanderId": event,
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