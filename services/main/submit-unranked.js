import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const unique = uuid.v1();
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tableHistory,
    Item: {
      gameId: unique,
      faction1: data.faction1,
      commander1: data.commander1,
      vp1: data.vp1,
      faction2: data.faction2,
      commander2: data.commander2,
      vp2: data.vp2,
      gameMode: data.gameMode,
      ranked: "unranked",
      version: "1.6",
      submittedBy: event.requestContext.identity.cognitoIdentityId,
      createdAt: Date.now(),
    }
  };

  const params4 = {
    TableName: process.env.tableFaction,
    Item: {
      gameId: unique,
      factionId: data.faction1,
      }
  };

  const params5 = {
    TableName: process.env.tableFaction,
    Item: {
      gameId: unique,
      factionId: data.faction2,
      }
  };

  const params6 = {
    TableName: process.env.tableCommander,
    Item: {
      gameId: unique,
      commanderId: data.commander1,
      }
  };

  const params7 = {
    TableName: process.env.tableCommander,
    Item: {
      gameId: unique,
      commanderId: data.commander2,
      }
  };

  try {
    await dynamoDbLib.call("put", params);
    await dynamoDbLib.call("put", params4);
    await dynamoDbLib.call("put", params5);
    await dynamoDbLib.call("put", params6);
    await dynamoDbLib.call("put", params7);
    return success(unique);
  } catch (e) {
    return failure({ status: e });
  }
}