import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  console.log(event.queryStringParameters);
  console.log(event.queryStringParameters.listId);

  const params = {
    TableName: process.env.savedLists,
    Key: {
      listId: event.queryStringParameters.listId
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      console.log(result);
      console.log(result.Item);
      console.log(result.Item.list);
      return success(result.Item.list);
    } else {
      return failure({ status: false, error: "List not found." });
    }
  } catch (e) {
    return failure({ status: e });
  }
}