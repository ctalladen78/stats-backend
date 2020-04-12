import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";


export async function main(event, context) {
  const data = JSON.parse(event.body);
  console.log(data);

    const params = {
        TableName: process.env.tournamentPlayers,
        Key: {
          playerId: data.playerId,
          tournamentId: data.tournamentId,
        },
        UpdateExpression: "SET list1 = :list1, list2 = :list2",
        ExpressionAttributeValues: {
          ":list1": data.list1,
          ":list2": data.list2,
        },
    };

    try {
      await dynamoDbLib.call("update", params);
      return success();
    } catch (e) {
      console.log(e);
      return failure({ status: e });
    }
  }