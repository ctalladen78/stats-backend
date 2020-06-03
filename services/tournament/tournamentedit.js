import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);

  console.log(data);

  const params = {
    TableName: process.env.tournamentInfo,
    Key: {
      tournamentId: data.tournamentId,
    },
    UpdateExpression: "SET tournamentName = :tournamentName, #loc = :newLocation, #date = :newDate, #end = :newEnd, allowSignup = :allowSignup, maxPlayers = :maxPlayers, country = :country, #region = :newRegion, info = :info, ttsTournament = :ttsTournament, pairing = :pairing",
    ExpressionAttributeValues: {
        ":tournamentName": data.tournamentName,
        ":newLocation": data.location,
        ":newDate": data.date,
        ":newEnd": data.end,
        ":allowSignup": data.allowSignup,
        ":maxPlayers": data.maxPlayers,
        ":country": data.country,
        ":newRegion": data.region,
        ":info": data.info,
        ":ttsTournament": data.tts,
        ":pairing": data.pairing,
    },
    ExpressionAttributeNames: {
        "#loc": "location",
        "#date": "date",
        "#end": "end",
        "#region": "region",
    },
  };

    try {
        await dynamoDbLib.call("update", params);
        return success(params.Item);
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}