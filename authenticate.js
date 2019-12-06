import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

// in the future, you could put these in a utility file and import it like done above
const calculatePlayerRankinging = (player1Ranking, player2Ranking, winner) => {
  if(winner === 'player1') {
    player1Ranking += 10;
  } else {
    player2Ranking += 10;
  }

  return [player1Ranking, player2Ranking];
}

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const playerRanksArray = calculatePlayerRankinging(data.player1Ranking, data.player2Ranking, data.winner);
  // insert into databaes
  const params = {
    TableName: process.env.tableName,
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

  try {
    await dynamoDbLib.call("authenticate", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}
#
