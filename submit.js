import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const unique = uuid.v1();
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

  if (data.gameId != null) {
    console.log("Given a Game Id", data.gameId);
    const params = {
      TableName: process.env.tableHistory,
      Item: {
        gameId: data.gameId,
        player1: data.player1,
        userName1: data.userName1,
        faction1: data.faction1,
        commander1: data.commander1,
        vp1: data.vp1,
        destroyed1: data.destroyed1,
        auth1: data.auth1,
        player2 : data.player2,
        userName2: data.userName2,
        faction2: data.faction2,
        commander2: data.commander2,
        vp2: data.vp2,
        destroyed2: data.destroyed2,
        auth2: data.auth2,
        gameMode: data.gameMode,
        ranked: "tournament",
        version: "1.6",
        submittedBy: event.requestContext.identity.cognitoIdentityId,
        createdAt: Date.now(),
        tournamentId: data.tournamentId,
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

    const params4 = {
      TableName: process.env.tableFaction,
      Item: {
        gameId: data.gameId,
        factionId: data.faction1,
        }
    };

    const params5 = {
      TableName: process.env.tableFaction,
      Item: {
        gameId: data.gameId,
        factionId: data.faction2,
        }
    };

    const params6 = {
      TableName: process.env.tableCommander,
      Item: {
        gameId: data.gameId,
        commanderId: data.commander1,
        }
    };

    const params7 = {
      TableName: process.env.tableCommander,
      Item: {
        gameId: data.gameId,
        commanderId: data.commander2,
        }
    };

    try {
      await dynamoDbLib.call("put", params);
      await dynamoDbLib.call("put", params2);
      await dynamoDbLib.call("put", params3);
      await dynamoDbLib.call("put", params4);
      await dynamoDbLib.call("put", params5);
      await dynamoDbLib.call("put", params6);
      await dynamoDbLib.call("put", params7);
      return success(data.gameId);
    } catch (e) {
      return failure({ status: e });
    }
  }

  else {
    console.log("No Game Id");
    const params = {
      TableName: process.env.tableHistory,
      Item: {
        gameId: unique,
        player1: data.player1,
        userName1: data.userName1,
        faction1: data.faction1,
        commander1: data.commander1,
        vp1: data.vp1,
        destroyed1: data.destroyed1,
        auth1: false,
        player2 : data.player2,
        userName2: data.userName2,
        faction2: data.faction2,
        commander2: data.commander2,
        vp2: data.vp2,
        destroyed2: data.destroyed2,
        auth2: false,
        gameMode: data.gameMode,
        ranked: "ranked",
        version: "1.6",
        submittedBy: event.requestContext.identity.cognitoIdentityId,
        createdAt: Date.now(),
      }
    };

    console.log(params);

    const params2 = {
      TableName: process.env.tablePlayer,
      Item: {
        gameId: unique,
        playerId: data.player1,
        }
    };

    const params3 = {
      TableName: process.env.tablePlayer,
      Item: {
        gameId: unique,
        playerId: data.player2,
        }
    };

    const params4 = {
      TableName: process.env.tableFaction,
      Item: {
        gameId: unique,
        factionId: data.faction1,
        }
    };

    const params5 = {
      TableName: process.env.tableFaction,
      Item: {
        gameId: unique,
        factionId: data.faction2,
        }
    };

    const params6 = {
      TableName: process.env.tableCommander,
      Item: {
        gameId: unique,
        commanderId: data.commander1,
        }
    };

    const params7 = {
      TableName: process.env.tableCommander,
      Item: {
        gameId: unique,
        commanderId: data.commander2,
        }
    };

    try {
      await dynamoDbLib.call("put", params);
      await dynamoDbLib.call("put", params2);
      await dynamoDbLib.call("put", params3);
      await dynamoDbLib.call("put", params4);
      await dynamoDbLib.call("put", params5);
      await dynamoDbLib.call("put", params6);
      await dynamoDbLib.call("put", params7);
      return success(unique);
    } catch (e) {
      return failure({ status: e });
    }
  }
}