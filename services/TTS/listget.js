import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  const fullstring = event.queryStringParameters.listId;
  const listId = fullstring.slice(0,36);
  const playerId = fullstring.slice(36);

  console.log(listId, playerId);

  const params = {
    TableName: process.env.savedLists,
    Key: {
      listId: listId,
      playerId: playerId,
    }
  };

  console.log(params);

  try {
    const result = await dynamoDbLib.call("get", params);
    return success(result.Item.list);
  } catch (e) {
    console.log(e);
    return failure({ status: e });
  }
}