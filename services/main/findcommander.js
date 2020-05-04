import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  event = event.pathParameters.id.replace("%20", " ").replace("%28", "(").replace("%29", ")").replace("%20", " ");
  event = event.split("-");
  let commanderId = event[1];
  let factionId = event[0];
  console.log(commanderId, factionId);

  const params = {
    TableName: process.env.commanderProfile,
    KeyConditionExpression: "commanderId = :commanderId",
    FilterExpression: "factionId = :factionId",
    ExpressionAttributeValues: {
        ":commanderId": commanderId,
        ":factionId": factionId,
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