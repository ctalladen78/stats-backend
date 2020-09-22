import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from "uuid";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const unique = uuid.v1();
  const userName = data.firstName.concat(data.secondName)

  const params = {
    TableName: process.env.playerProfile,
    Item: {
      playerId: unique,
      firstName: data.firstName,
      secondName: data.secondName,
      userName: userName,
      ranking: 1500,
      unclaimed: true,
      newRegion: "N/A",
      country: "N/A",
      version: 2,
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