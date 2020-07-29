import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  console.log(event.listId);
  const params = {
    TableName: process.env.savedLists,
    Key: {
      listId: event.listId
    }
  };

  try {
    const result = await dynamoDbLib.call("get", params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item.list);
    } else {
      return failure({ status: false, error: "List not found." });
    }
  } catch (e) {
    return failure({ status: e });
  }
}