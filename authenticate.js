import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

const calculateGameResult = (vp1, vp2) => {
  const gameResult = "Not found";
  if (vp1-vp2 > 4) {
      gameResult = "player 1 crushing win";
  }
  if (vp1-vp2 == 3 || 4) {
      gameResult = "player 1 major win";
  }
  if (vp1-vp2 == 1 || 2) {
      gameResult = "player 1 minor win";
  }
  if (vp1-vp2 < (-4)) {
      gameResult = "player 2 crushing win";
  }
  if (vp1-vp2 == -1 || -2) {
      gameResult = "player 2 minor win";
  }
  if (vp1-vp2 == -3 || -4) {
      gameResult = "player 2 major win";
  }
  else {
      gameResult = "draw";
  }
  return (gameResult);
}

// in the future, you could put these in a utility file and import it like done above
const calculatePlayerRankinging = (playerRanking1, playerRanking2, factionRanking1, factionRanking2, gameResult) => {
    const ranking1 = Math.pow(10, (playerRanking1 + factionRanking1)/400);
    const ranking2 = Math.pow(10, (playerRanking2 + factionRanking2)/400);

    const winChance = ranking1/(ranking1 + ranking2);

    const kFactor = 50;
    const kFaction = 10;
  
    const ratingChange = 0;
    const factionChange = 0;

    if (gameResult == "player 1 minor win") {
        ratingChange = kFactor*(1 - winChance)*0.5;
        factionChange = kFaction*(1 - winChance)*0.5;
    }
    if (gameResult == "player 1 major win") {
        ratingChange = kFactor*(1 - winChance)*0.75;
        factionChange = kFaction*(1 - winChance)*0.75;
    }
    if (gameResult == "player 1 crushing win") {
        ratingChange = kFactor*(1 - winChance);
        factionChange = kFaction*(1 - winChance);
    }
    if (gameResult == "player 2 minor win") {
        ratingChange = kFactor*(winChance)*0.5;
        factionChange = kFaction*(winChance)*0.5;
    }
    if (gameResult == "player 2 major win") {
        ratingChange = kFactor*(winChance)*0.75;
        factionChange = kFaction*(winChance)*0.75; 
    }
    if (gameResult == "player 2 crushing win") {
        ratingChange = kFactor*(winChance);
        factionChange = kFaction*(winChance);
    }

    return ([ranking1 , ranking2, winChance, ratingChange, factionChange])
}

const player1Ranking = (player1) => {
  const params = {
    TableName: process.env.tableProfile,
    KeyConditionExpression: "playerId = :playerId",
    ExpressionAttributeValues: {
      ":playerId": player1
    },

    playerRanking1 = ranking,
  }
}

const player2Ranking = (player2) => {
  const params = {
    TableName: process.env.tableProfile,
    KeyConditionExpression: "playerId = :playerId",
    ExpressionAttributeValues: {
      ":playerId": player2
    },

    playerRanking2 = ranking,
  }
}

export async function main(event, context) {
  const data = JSON.parse(event.body);
  try {
    const gameResult = calculateGameResult(data.vp1, data.vp2);
    const player1Ranking = await dynamoDbLib.call("get", playerRanking1); // make this params query the right table
    const player2Ranking = await dnamoDbLib.call("get", playerRanking2); // make this params query the right table
    const faction1Ranking = await dynamoDbLib.call("get", factionRanking1); // make this params query the right table
    const faction2Ranking = await dnamoDbLib.call("get", factionRanking2); // make this params query the right table
    const playerRanksArray = calculatePlayerRankinging(playerRanking1, playerRanking2, factionRanking1, factionRanking2, gameResult);
    // insert into databases
    const params = {
      TableName: process.env.tableHistory,
      // 'Key' defines the partition key and sort key of the item to be updated
      // - 'userId': Identity Pool identity id of the authenticated user
      // - 'noteId': path parameter
      Key: {
        gameId: event.pathParameters.id,
      },
      // 'UpdateExpression' defines the attributes to be updated
      // 'ExpressionAttributeValues' defines the value in the update expression
      UpdateExpression: "SET authenticated = :authenticated",
      ExpressionAttributeValues: {
        ":authenticated": data.authenticated,
      },
      // 'ReturnValues' specifies if and how to return the item's attributes,
      // where ALL_NEW returns all attributes of the item after the update; you
      // can inspect 'result' below to see how it works with different settings
      ReturnValues: "ALL_NEW"
    };

    await dynamoDbLib.call("authenticate", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
