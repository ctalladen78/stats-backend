import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    console.log(event);
    
  const params = {
    TableName: process.env.savedLists,
    KeyConditionExpression: "listId = :listId",
    ExpressionAttributeValues: {
        ":listId": event.pathParameters.id
    },
  };

  console.log(params);

  try {
    const result = await dynamoDbLib.call("query", params);
    return success(result.Items);
  } catch (e) {
    console.log(e);
    return failure({ status: e });
  }
}