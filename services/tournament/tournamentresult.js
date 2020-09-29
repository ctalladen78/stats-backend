import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure, buildResponse} from "../../libs/response-lib";

const findGame = (data) => {
  const params = {
    TableName: process.env.tournamentGames,
    Key: {
      gameId: data.gameId,
      tournamentId: data.tournamentId,
    },
  };
  return params;
};

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
      UpdateExpression: "SET resultSubmitted = :set, vp1 = :vp1, vp2 = :vp2, ud1 = :ud1, ud2 = :ud2, commander1 = :commander1, commander2 = :commander2, list1Location = :list1Location, list2Location = :list2Location, tp1 = :tp1, tp2 = :tp2, sp1 = :sp1, sp2 = :sp2, destroyed1 = :destroyed1, destroyed2 = :destroyed2, resigned1 = :resigned1, resigned2 = :resigned2, auth1 = :auth1, auth2 = :auth2, pointsLeft1 = :pointsLeft1, pointsLeft2 = :pointsLeft2",
      ExpressionAttributeValues: {
        ":set": data.set,
        ":vp1": data.vp1,
        ":vp2": data.vp2,
        ":ud1": data.ud1,
        ":ud2": data.ud2,
        ":commander1": data.commander1,
        ":commander2": data.commander2,
        ":list1Location": data.list1Location,
        ":list2Location": data.list2Location,
        ":tp1": data.tp1,
        ":tp2": data.tp2,
        ":sp1": data.sp1,
        ":sp2": data.sp2,
        ":destroyed1": data.destroyed1,
        ":destroyed2": data.destroyed2,
        ":resigned1": data.resigned1,
        ":resigned2": data.resigned2,
        ":auth1": data.auth1,
        ":auth2": data.auth2,
        ":pointsLeft1": data.pointsLeft1,
        ":pointsLeft2": data.pointsLeft2,
      },
    };

    if (data.auth1 === true && data.auth2 === true) {
      var params2 = {
        TableName: process.env.tournamentPlayers,
        Key: {
          playerId: data.player1,
          tournamentId: data.tournamentId,
        },
        UpdateExpression: "SET VPs = :vp, TPs = :tp, SPs = :sp, pointsDestroyed = :ud, gamesPlayed = :gamesPlayed",
        ExpressionAttributeValues: {
          ":vp": data.vpTotal1,
          ":tp": data.totalTp1,
          ":sp": data.totalSp1,
          ":ud": data.udTotal1,
          ":gamesPlayed": data.gamesPlayed1
        },
      };

      var params3 = {
        TableName: process.env.tournamentPlayers,
        Key: {
          playerId: data.player2,
          tournamentId: data.tournamentId,
        },
        UpdateExpression: "SET VPs = :vp, TPs = :tp, SPs = :sp, pointsDestroyed = :ud, gamesPlayed = :gamesPlayed",
        ExpressionAttributeValues: {
          ":vp": data.vpTotal2,
          ":tp": data.totalTp2,
          ":sp": data.totalSp2,
          ":ud": data.udTotal2,
          ":gamesPlayed": data.gamesPlayed2
        },
      };
    }

  try{
    const result = await dynamoDbLib.call("get", findGame(data));
    console.log(result);
    console.log(result.Item.resultSubmitted);
    if (((data.auth1 === true && data.auth2 === true) && (result.Item.auth1 === false || result.Item.auth2 === false)) || result.Item.resultSubmitted === false) {
      try {
        await dynamoDbLib.call("update", params);
        if (data.auth1 === true && data.auth2 === true) {
          await dynamoDbLib.call("update", params2);
          await dynamoDbLib.call("update", params3);
        }
        return success(true);
      } catch (e) {
        console.log(e);
        return failure(e);
      }
    } else {
      console.log("RETURN CUSTOM ERROR");
      return buildResponse(500, "Result Already Submitted");
    }
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}