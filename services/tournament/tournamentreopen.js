import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.tournamentInfo,
    Key: {
      tournamentId: data,
    },
    UpdateExpression: "SET closed = :closed",
    ExpressionAttributeValues: {
      ":closed": false,
    },
  };

  const params2 = {
    TableName: process.env.tournamentWinners,
    Item: {
      tournamentId: data,
      }
  };

  try {
    await dynamoDbLib.call("update", params);
    await dynamoDbLib.call("delete", params2);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}