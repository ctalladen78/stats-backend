import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
    console.log(event);

    const data = JSON.parse(event.body);
    console.log(data);

    const params = {
      TableName: process.env.tableHistory,
      Key: {
        gameId: event.pathParameters.id,
      },
      UpdateExpression: "SET auth1 = :auth1",
      ExpressionAttributeValues: {
        ":auth1": true,
      },
    };

    try{
      await dynamoDbLib.call("update", params);
    return success(true);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}