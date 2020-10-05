import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from "uuid";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const unique = uuid.v1();

  const params = {
    TableName: process.env.tableHistory,
    Item: {
        gameId: data.gameId,
        url: data.url,
    }
  };

  const params2 = {
    TableName: process.env.notifications,
    Item: {
        noteId: unique,
        type: "video",
        channel: data.channel,
        createdAt: Date.now(),
        link: data.gameId,
        url: data.url,
    }
  };

  try {
    await dynamoDbLib.call("update", params);
    await dynamoDbLib.call("put", params2);
    return success(params2.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}