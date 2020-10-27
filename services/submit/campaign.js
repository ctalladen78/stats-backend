import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

    const params = {
        TableName: process.env.tableHistory,
        Item: {
            gameId: data.gameId,
            player1: data.player1,
            userName1: data.userName1,
            faction1: data.faction1,
            commander1: data.commander1,
            list1Location: data.list1Location,
            vp1: data.vp1,
            destroyed1: data.destroyed1,
            resigned1: data.resigned1,
            auth1: data.auth1,
            player2 : data.player2,
            userName2: data.userName2,
            faction2: data.faction2,
            commander2: data.commander2,
            list2Location: data.list2Location,
            vp2: data.vp2,
            destroyed2: data.destroyed2,
            resigned2: data.resigned2,
            auth2: data.auth2,
            gameMode: data.gameMode,
            ranked: "campaign",
            version: "1.6",
            submittedBy: event.requestContext.identity.cognitoIdentityId,
            region: data.region,
            createdAt: Date.now(),
            tournamentId: data.tournamentId,
            pointsLeft1: data.pointsLeft1,
            pointsLeft2: data.pointsLeft2,
        }
    };

    console.log(params);

    const params2 = {
        TableName: process.env.tablePlayer,
        Item: {
            gameId: data.gameId,
            playerId: data.player1,
            }
    };

    const params3 = {
        TableName: process.env.tablePlayer,
        Item: {
            gameId: data.gameId,
            playerId: data.player2,
            }
    };

    try {
        await dynamoDbLib.call("put", params);
        await dynamoDbLib.call("put", params2);
        await dynamoDbLib.call("put", params3);
        return success(data.gameId);
    } catch (e) {
        return failure({ status: e });
    }
}