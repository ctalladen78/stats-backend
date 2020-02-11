import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


export async function main(event) {
  console.log(event);
  const all = JSON.parse(event.body);
  console.log(all);
  const match = JSON.parse(event.body.game);
  console.log(match);
  const data = JSON.parse(event.body.data);
  console.log(data);

  const unique = uuid.v1();

  const params = {
    TableName: process.env.tournamentGames,
    Item: {
      gameId: unique,
      tournamentId: data.tournamentId,
      round: data.round,
      player1: match.home,
      player2 : match.player2,
      gameMode: data.gameMode,
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