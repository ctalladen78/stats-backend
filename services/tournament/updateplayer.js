import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const unique = uuid.v1();
  const data = JSON.parse(event.body);

  console.log(data);

  if (data.club === "") {
    const params = {
        TableName: process.env.tournamentPlayers,
        Key: {
            tournamentId: data.tournamentId,
            playerId: data.playerId,
        },
        UpdateExpression: "SET faction = :faction, commander1 = :commander1, commander2 = :commander2",
        ExpressionAttributeValues: {
            ":faction": data.faction,
            ":commander1": data.commander1,
            ":commander2": data.commander2,
        },
    };
    try {
      await dynamoDbLib.call("update", params);
      return success(unique);
    } catch (e) {
      console.log(e);
      return failure({ status: e });
    }
  } else {
    const params = {
        TableName: process.env.tournamentPlayers,
        Key: {
          tournamentId: data.tournamentId,
          playerId: data.playerId,
        },
        UpdateExpression: "SET faction = :faction, commander1 = :commander1, commander2 = :commander2, club = :club REMOVE list1, list2",
        ExpressionAttributeValues: {
            ":faction": data.faction,
            ":commander1": data.commander1,
            ":commander2": data.commander2,
            ":club": data.club,
        },
    };
    try {
      await dynamoDbLib.call("update", params);
      return success(unique);
    } catch (e) {
      console.log(e);
      return failure({ status: e });
    }
  }
}