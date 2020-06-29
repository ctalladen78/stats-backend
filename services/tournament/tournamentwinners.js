import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main() {
  const params = {
    TableName: process.env.tournamentWinners,
  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ e });
  }
}