import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main() {
  const params = {
    TableName: process.env.tableName,
    ProjectionExpression: "gameId, player1, faction1, commander1, vp1, player2, faction2, commander2, vp2"
  };

  try {
    const result = await dynamoDbLib.call("scan", params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    return failure({ status: false });
  }
}