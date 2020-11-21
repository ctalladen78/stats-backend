import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure} from "../../libs/response-lib";

export async function main(event) {
    console.log(event);

    const data = JSON.parse(event.body);
    console.log(data);

    if (data.player1Rating !== undefined) {
      var params4 = {
        TableName: process.env.tournamentGames,
        Key: {
          gameId: data.gameId,
          tournamentId: data.tournamentId,
        },
        UpdateExpression: "SET player1Rating = :player1Rating",
        ExpressionAttributeValues: {
          ":player1Rating": data.player1Rating,
        },
      };
    }

    if (data.player2Rating !== undefined) {
      var params5 = {
        TableName: process.env.tournamentGames,
        Key: {
          gameId: data.gameId,
          tournamentId: data.tournamentId,
        },
        UpdateExpression: "SET player2Rating = :player2Rating",
        ExpressionAttributeValues: {
          ":player2Rating": data.player2Rating,
        },
      };
    }

    try{
        if (data.player1Rating !== undefined) {
        await dynamoDbLib.call("update", params4);
        }
        if (data.player2Rating !== undefined) {
        await dynamoDbLib.call("update", params5);
        }
        return success(true);
    } catch (e) {
    console.log(e);
    return failure(e);
    }
}