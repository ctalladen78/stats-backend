import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";


export async function main(event, context) {
  const unique = uuid.v1();
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.tournamentPlayers,
    Item: {
      tournamentId: data.tournamentId,
      playerId: data.playerId,
      userName: data.userName,
      faction: data.faction,
      commander1: data.commander1,
      commander2: data.commander2,
      startingRank: data.ranking,
      TPs: 0,
      SPs: 0,
      VPs: 0,
      gamesPlayed: 0,
      pointsDestroyed: 0,
    }
  };

  console.log(params);

  try {
    await dynamoDbLib.call("put", params);
    return success(unique);
  } catch (e) {
    return failure({ status: e });
  }
}