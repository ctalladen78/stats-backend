import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event) {
    console.log(event);

    const data = JSON.parse(event.body);
    console.log(data);

    const params = {
      TableName: process.env.tournamentGames,
      Key: {
        gameId: data.gameId,
        tournamentId: data.tournamentId,
      },
      UpdateExpression: "SET resultSubmitted = :true, vp1 = :vp1, vp2 = :vp2, ud1 = :ud1, ud2 = :ud2, commander1 = :commander1, commander2 = :commander2, tp1 = :tp1, tp2 = :tp2",
      ExpressionAttributeValues: {
        ":true": true,
        ":vp1": data.vp1,
        ":vp2": data.vp2,
        ":ud1": data.ud1,
        ":ud2": data.ud2,
        ":commander1": data.commander1,
        ":commander2": data.commander2,
        ":tp1": data.tp1,
        ":tp2": data.tp2
      },
    };

    const params2 = {
      TableName: process.env.tournamentPlayers,
      Key: {
        playerId: data.player2,
        tournamentId: data.tournamentId,
      },
      UpdateExpression: "SET VPs = :vp, TPs = :tp, SPs = :sp, pointsDestroyed = :ud",
      ExpressionAttributeValues: {
        ":vp": data.vpTotal1,
        ":tp": data.tp1,
        ":sp": data.sp1,
        ":ud": data.udTotal1
      },
    };

    console.log(params2);

    const params3 = {
      TableName: process.env.tournamentPlayers,
      Key: {
        playerId: data.player1,
        tournamentId: data.tournamentId,
      },
      UpdateExpression: "SET VPs = :vp, TPs = :tp, SPs = :sp, pointsDestroyed = :ud",
      ExpressionAttributeValues: {
        ":vp": data.vpTotal2,
        ":tp": data.tp2,
        ":sp": data.sp2,
        ":ud": data.udTotal2
      },
    };

    console.log(params3);

    try{
      await dynamoDbLib.call("update", params);
      await dynamoDbLib.call("update", params2);
      await dynamoDbLib.call("update", params3);
    return success(true);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}