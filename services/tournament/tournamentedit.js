import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
  var data = JSON.parse(event.body);

  if (data.country === undefined) {
    data.country = "";
  }
  if (data.region === undefined) {
    data.region = "";
  }
  if (data.location === undefined) {
    data.location = "";
  }

  console.log(data);
  var params;

  if (data.info === undefined) {
    console.log("No info");
    params = {
      TableName: process.env.tournamentInfo,
      Key: {
        tournamentId: data.tournamentId.tournamentId,
      },
      UpdateExpression: "SET tournamentName = :tournamentName, #loc = :newLocation, #date = :newDate, #end = :newEnd, allowSignup = :allowSignup, points = :points, ks = :ks, unreleased = :unreleased, notFinal = :notFinal, maxPlayers = :maxPlayers, country = :country, #region = :newRegion, ttsTournament = :ttsTournament, pairing = :pairing, changeLists = :changeLists, changeCommanders = :changeCommanders, changeFactions = :changeFactions, campaign = :campaign",
      ExpressionAttributeValues: {
          ":tournamentName": data.tournamentName,
          ":newLocation": data.location,
          ":newDate": data.date,
          ":newEnd": data.end,
          ":allowSignup": data.allowSignup,
          ":maxPlayers": data.maxPlayers,
          ":points": data.points,
          ":ks": data.ks,
          ":unreleased": data.unreleased,
          ":notFinal": data.notFinal,
          ":country": data.country,
          ":newRegion": data.region,
          ":ttsTournament": data.tts,
          ":pairing": data.pairing,
          ":changeLists": data.changeLists,
          ":changeCommanders": data.changeCommanders,
          ":changeFactions": data.changeFactions,
          ":campaign": data.campaign,
      },
      ExpressionAttributeNames: {
          "#loc": "location",
          "#date": "date",
          "#end": "end",
          "#region": "region",
      },
    };
  } else {
    console.log("Have info");
    params = {
      TableName: process.env.tournamentInfo,
      Key: {
        tournamentId: data.tournamentId.tournamentId,
      },
      UpdateExpression: "SET tournamentName = :tournamentName, #loc = :newLocation, #date = :newDate, #end = :newEnd, allowSignup = :allowSignup, maxPlayers = :maxPlayers, points = :points, ks = :ks, unreleased = :unreleased, notFinal = :notFinal, country = :country, #region = :newRegion, info = :info, ttsTournament = :ttsTournament, pairing = :pairing, changeLists = :changeLists, changeCommanders = :changeCommanders, changeFactions = :changeFactions, campaign = :campaign",
      ExpressionAttributeValues: {
          ":tournamentName": data.tournamentName,
          ":newLocation": data.location,
          ":newDate": data.date,
          ":newEnd": data.end,
          ":allowSignup": data.allowSignup,
          ":maxPlayers": data.maxPlayers,
          ":points": data.points,
          ":ks": data.ks,
          ":unreleased": data.unreleased,
          ":notFinal": data.notFinal,
          ":country": data.country,
          ":newRegion": data.region,
          ":info": data.info,
          ":ttsTournament": data.tts,
          ":pairing": data.pairing,
          ":changeLists": data.changeLists,
          ":changeCommanders": data.changeCommanders,
          ":changeFactions": data.changeFactions,
          ":campaign": data.campaign,
      },
      ExpressionAttributeNames: {
          "#loc": "location",
          "#date": "date",
          "#end": "end",
          "#region": "region",
      },
    };
  }

  console.log(params);

    try {
        await dynamoDbLib.call("update", params);
        return success(params.Item);
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}