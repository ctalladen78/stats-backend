import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.tournamentPlayers,
    Key: {
      playerId: data.playerId,
      tournamentId: data.tournamentId,
      }
  };

  console.log(params);

  try {
    await dynamoDbLib.call("delete", params);
    return success(data.gameId);
  } catch (e) {
    return failure(e);
  }
}