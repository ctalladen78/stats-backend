import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event) {
  const unique = uuid.v1();
  const data = JSON.parse(event.body);

  console.log(data);

    const params = {
        TableName: process.env.tableHistory,
        Item: {
        gameId: unique,
        vp1: data.vp1,
        vp2: data.vp2,
        }
    };

    console.log(params);

    try {
      await dynamoDbLib.call("put", params);
      return success(data.gameId);
    } catch (e) {
      return failure({ status: e });
    }
}