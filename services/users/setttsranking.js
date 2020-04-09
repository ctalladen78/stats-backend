import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.playerProfile,
    Key: {
      playerId: data.playerId,
    },
    UpdateExpression: "SET ttsRanking= :ttsRanking",
    ExpressionAttributeValues: {
      ":ttsRanking": 1500,
    },
  };

  console.log(params);

  try {
    await dynamoDbLib.call("update", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}