import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableName,
    Item: {
      gameId: uuid.v1(),
      player1: data.player1,
      faction1: data.faction1,
      commander1: data.commander1,
      vp1: data.vp1,
      player2 : data.player2,
      faction2: data.faction2,
      commander2: data.commander2,
      vp2: data.vp2,
      createdAt: Date.now()
    }    
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false });
  }
}