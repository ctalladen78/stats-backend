import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  const listIdWith = event.queryStringParameters.listId;
  const listId = {listIdWith};

  console.log(listId);

  const params = {
    TableName: process.env.savedLists,
    Key: {
      listId: listIdWith,
      playerId: "test"
    }
  };

  console.log(params);

  try {
    const result = await dynamoDbLib.call("get", params);
    console.log(result);
    console.log(result.Item);
    console.log(result.Item.list);
    return success(result);
  } catch (e) {
    console.log(e);
    return failure({ status: e });
  }
}