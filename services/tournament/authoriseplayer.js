import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tournamentPlayers,
    Key: {
      playerId: data.playerId,
      tournamentId: data.tournamentId,
    },
    UpdateExpression: "SET waitingList = :waitingList",
    ExpressionAttributeValues: {
      ":waitingList": false,
    },
  };

  try {
    await dynamoDbLib.call("update", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}