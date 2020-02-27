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

    if (m.away === null) {
        const params2 = {
            TableName: process.env.tournamentPlayers,
            Key: {
              playerId: m.home,
              tournamentId: data.tournamentId.tournamentId,
            },
            UpdateExpression: "SET TPs = :tp, SPs = :sp, gamesPlayed = :gamesPlayed",
            ExpressionAttributeValues: {
              ":tp": 3,
              ":sp": 4,
              ":gamesPlayed": 1
            },
          };        
    }

    console.log(params);

    try {
        await dynamoDbLib.call("put", params);
        if (m.away === null) {
            await dynamoDbLib.call("update", params2);
        }
    } catch (e) {
        console.log(e);
        return failure({ status: e });
    }
    };
    return success();
}