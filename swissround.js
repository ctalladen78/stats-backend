import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


export async function main(event) {
  console.log(event);
  const data = JSON.parse(event.body);
  console.log(data);
  const match = (data.game);
  console.log(match);
  const info = (data.data);
  console.log(info);

  const unique = uuid.v1();

  const params = {
    TableName: process.env.tournamentGames,
    Item: {
      gameId: unique,
      tournamentId: info.tournamentId,
      round: info.round,
      player1: match.home,
      player2 : match.player2,
      gameMode: info.gameMode,
      resultSubmitted: "false",
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(unique);
  } catch (e) {
    return failure({ status: e });
  }
}