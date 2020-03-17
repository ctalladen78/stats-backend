import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const unique = uuid.v1();
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const random = (Math.ceil(Math.random()*100));



  console.log(data);

  if (data.club == "") {
    const params = {
      TableName: process.env.tournamentPlayers,
      Item: {
        tournamentId: data.tournamentId,
        playerId: data.playerId,
        userName: data.userName,
        firstName: data.firstName,
        secondName: data.secondName,
        faction: data.faction,
        commander1: data.commander1,
        commander2: data.commander2,
        club: null,
        startingRank: data.ranking,
        seed: random,
        TPs: 0,
        SPs: 0,
        VPs: 0,
        gamesPlayed: 0,
        pointsDestroyed: 0,
        hadBye: false
      }
    };

    console.log(params);

    try {
      await dynamoDbLib.call("put", params);
      return success(unique);
    } catch (e) {
      console.log(e);
      return failure({ status: e });
    }
  } else {
    const params = {
      TableName: process.env.tournamentPlayers,
      Item: {
        tournamentId: data.tournamentId,
        playerId: data.playerId,
        userName: data.userName,
        firstName: data.firstName,
        secondName: data.secondName,
        faction: data.faction,
        commander1: data.commander1,
        commander2: data.commander2,
        club: data.club,
        startingRank: data.ranking,
        seed: random,
        TPs: 0,
        SPs: 0,
        VPs: 0,
        gamesPlayed: 0,
        pointsDestroyed: 0,
        hadBye: false
      }
    };

    console.log(params);

    try {
      await dynamoDbLib.call("put", params);
      return success(unique);
    } catch (e) {
      console.log(e);
      return failure({ status: e });
    }
  }
}