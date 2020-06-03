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
    UpdateExpression: "SET tournamentName = :tournamentName, newLocation = :newLocation, date = :date, end = :end, allowSignup = :allowSignup, maxPlayers = :maxPlayers, country = :country, region = :region, info = :info, ttsTournament = :ttsTournament, pairing = :pairing",
    ExpressionAttributeValues: {
        ":tournamentName": data.tournamentName,
        ":newLocation": data.location,
        ":date": data.date,
        ":end": data.end,
        ":allowSignup": data.allowSignup,
        ":maxPlayers": data.maxPlayers,
        ":country": data.country,
        ":region": data.region,
        ":info": data.info,
        ":ttsTournament": data.ttsTournament,
        ":pairing": data.pairing,
    },
    ExpressionAttributeNames: {
        "newLocation": "location"
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