import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from "uuid";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const unique = uuid.v1();

  const params = {
    TableName: process.env.notifications,
    Item: {
        noteId: unique,
        type: data.type,
        createdAt: Date.now(),
        link: data.link,
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}