import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(data);

  const params = {
    TableName: process.env.tournamentGames,
    Key: {
      tournamentId: data.tournamentId,
      gameId: data.gameId,
      }
  };

  const params2 = {
    TableName: process.env.tournamentPlayers,
    Key: {
        playerId: data.player1,
        tournamentId: data.tournamentId,
    },
    UpdateExpression: "SET TPs = :tp, SPs = :sp, gamesPlayed = :gamesPlayed, hadBye = :hadBye",
    ExpressionAttributeValues: {
        ":tp": (data.player1Info.TPs - 3),
        ":sp": (data.player1Info.SPs - 4),
        ":gamesPlayed": (data.player1Info.gamesPlayed - 1),
        ":hadBye": false
    },
};
console.log(params);
console.log(params2);

  try {
    await dynamoDbLib.call("delete", params);
    if (data.player2 === null) {
      await dynamoDbLib.call("update", params2);
    }
    return success(data.gameId);
  } catch (e) {
    return failure(e);
  }
}