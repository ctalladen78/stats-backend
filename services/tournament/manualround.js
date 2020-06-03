import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
  const data = JSON.parse(event.body);
  const match = (data.game);
  const info = (data.data);
  const id = (data.tournamentId);
  var i = 0;

  for(const m of match) {
      console.log(m);
      console.log(match);
    const unique = uuid.v1();
    i += 1;

    const params = {
        TableName: process.env.tournamentGames,
        Item: {
        gameId: unique,
        tournamentId: data.tournamentId.tournamentId,
        round: data.data.round,
        table: i,
        player1: m.home,
        player2: m.away,
        gameMode: data.data.gameMode,
        resultSubmitted: false,
        region: data.region,
        }
    };

    try {
        await dynamoDbLib.call("put", params);
    } catch (e) {
        console.log(e);
        return failure({ status: e });
    }
    };
    return success();
}