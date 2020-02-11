import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


export async function main(matchups, event) {
  const unique = uuid.v1();
  // Request body is passed in as a JSON encoded string in 'event.body'
  const match = JSON.parse(matchups.body);
  const data = JSON.parse(event.body);

  console.log(match);
  console.log(data);

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