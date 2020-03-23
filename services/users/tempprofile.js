import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const unique = uuid.v1();

  const params = {
    TableName: process.env.playerProfile,
    Item: {
      playerId: unique,
      firstName: data.firstName,
      secondName: data.secondName,
      userName: "Unclaimed",
      ranking: 1500,
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