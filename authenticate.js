import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

//calculates result from passed in vps
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

// calculate rankings changes and gives out an array
const calculatePlayerRanking = (playerRanking1, playerRanking2, factionRanking1, factionRanking2, gameResult) => {
    const ranking1 = Math.pow(10, (playerRanking1 + factionRanking1)/400);
    const ranking2 = Math.pow(10, (playerRanking2 + factionRanking2)/400);

    const winChance = ranking1/(ranking1 + ranking2);

    const kFactor = 50;
    const kFaction = 10;
  
    const rankingChange = 0;
    const factionChange = 0;

    if (gameResult == "player 1 minor win") {
        rankingChange = kFactor*(1 - winChance)*0.5;
        factionChange = kFaction*(1 - winChance)*0.5;
    }
    if (gameResult == "player 1 major win") {
        rankingChange = kFactor*(1 - winChance)*0.75;
        factionChange = kFaction*(1 - winChance)*0.75;
    }
    if (gameResult == "player 1 crushing win") {
        rankingChange = kFactor*(1 - winChance);
        factionChange = kFaction*(1 - winChance);
    }
    if (gameResult == "player 2 minor win") {
        rankingChange = kFactor*(winChance)*0.5;
        factionChange = kFaction*(winChance)*0.5;
    }
    if (gameResult == "player 2 major win") {
        rankingChange = kFactor*(winChance)*0.75;
        factionChange = kFaction*(winChance)*0.75; 
    }
    if (gameResult == "player 2 crushing win") {
        rankingChange = kFactor*(winChance);
        factionChange = kFaction*(winChance);
    }

    return ([rankingChange, factionChange])
}

//Calls db based upon player Id passed in
const findPlayerRank = (player) => {
  const params = {
    TableName: process.env.tableProfile,
    KeyConditionExpression: "playerId = :playerId",
    ExpressionAttributeValues: {
      ":playerId": player
    }
  }
  return params
}

const findFactionRank = (faction) => {
  const params = {
    TableName: process.env.tableProfile,
    KeyConditionExpression: "factionId = :factionId",
    ExpressionAttributeValues: {
      ":factionId": faction
    }
  }
  return params
}



export async function main(event, context) {
  const data = JSON.parse(event.body);
  try {
    const gameResult = calculateGameResult(data.vp1, data.vp2);
    const player1Profile = await dynamoDbLib.call("get", findPlayerRank(data.player1)); // call player 1 data from table
    const player2Profile = await dynamoDbLib.call("get", findPlayerRank(data.player2)); // call player 2 data from table
    const faction1Profile = await dynamoDbLib.call("get", findFactionRank(data.faction1));  // call faction 1 data from table
    const faction2Profile = await dynamoDbLib.call("get", findFactionRank(data.faction2));  // call faction 2 data from table
    const playerRanksArray = calculatePlayerRanking(player1Profile.Item.ranking, player2Profile.Item.ranking, faction1Profile.Item.ranking, faction2Profile.Item.ranking, gameResult);
    // insert into databases
    const params = {
      TableName: process.env.tableHistory,
      Key: {
        gameId: event.pathParameters.id,
      },
      UpdateExpression: "SET authenticated = :authenticated",
      ExpressionAttributeValues: {
        ":authenticated": data.authenticated,
      },
      ReturnValues: "ALL_NEW"
    };

    const params2 = {
      TableName: process.env.tableProfile,
      Key: {
        playerId: data.player1,
      },
      UpdateExpression: "SET ranking = :ranking",
      ExpressionAttributeValues: {
        ":ranking": player1Profile.Item.ranking + rankingChange, //this needs to come from playerRanksArray
      },
      ReturnValues: "ALL_NEW"
    }

    const params3 = {
      TableName: process.env.tableProfile,
      Key: {
        playerId: data.player2,
      },
      UpdateExpression: "SET ranking = :ranking",
      ExpressionAttributeValues: {
        ":ranking": player2Profile.Item.ranking - rankingChange,
      },
      ReturnValues: "ALL_NEW"
    }

    const params4 = {
      TableName: process.env.tableFactions,
      Key: {
        playerId: data.faction1,
      },
      UpdateExpression: "SET ranking = :ranking",
      ExpressionAttributeValues: {
        ":ranking": faction1Profile.Item.ranking + factionChange,
      },
      ReturnValues: "ALL_NEW"
    }

    const params5 = {
      TableName: process.env.tableFactions,
      Key: {
        playerId: data.faction2,
      },
      UpdateExpression: "SET ranking = :ranking",
      ExpressionAttributeValues: {
        ":ranking": faction2Profile.Item.ranking - factionChange,
      },
      ReturnValues: "ALL_NEW"
    }

    await dynamoDbLib.call("authenticate", params);
    await dynamoDbLib.call("put", params2);
    await dynamoDbLib.call("put", params3);
    await dynamoDbLib.call("put", params4);
    await dynamoDbLib.call("put", params5);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
