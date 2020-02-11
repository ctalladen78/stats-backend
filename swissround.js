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
  const id = (data.tournamentId);
  console.log(id);

  for(const m of match) {
      console.log(m);
      console.log(match);
    const unique = uuid.v1();

    const params = {
        TableName: process.env.tournamentGames,
        Item: {
        gameId: unique,
        tournamentId: data.tournamentId.tournamentId,
        round: data.data.round,
        player1: m.home,
        player2 : m.away,
        gameMode: data.data.gameMode,
        resultSubmitted: "false",
        }
    };

    console.log(params);

    try {
        await dynamoDbLib.call("put", params);
    } catch (e) {
        console.log(e);
        return failure({ status: e });
    }
    };
    return;
}