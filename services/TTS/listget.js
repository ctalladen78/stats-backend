import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  console.log(event);
  const fullstring = event.queryStringParameters.listId;
  const listId = fullstring.slice(0,36);

  const params = {
    TableName: process.env.savedLists,
    KeyConditionExpression: "listId = :listId",
    ExpressionAttributeValues: {
      ":listId": listId,
    },
  };

  console.log(params);

  try {
    const result = await dynamoDbLib.call("query", params);
    console.log(result.Items[0].list, result.Items[0].faction.name);
    return success({list: result.Items[0].list.list, faction: result.Items[0].faction.name});
  } catch (e) {
    console.log(e);
    return failure({ status: e });
  }
}