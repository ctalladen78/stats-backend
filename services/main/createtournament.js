import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from "uuid";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const unique = uuid.v1();

  console.log(data);

  if (data.tts === true) {
    if (data.info == "") {
      const params = {
        TableName: process.env.tournamentInfo,
        Item: {
          tournamentId: unique,
          adminId: event.requestContext.identity.cognitoIdentityId,
          tournamentName: data.tournamentName,
          date: data.date,
          end: data.end,
          allowSignup: data.allowSignup,
          maxPlayers: data.maxPlayers,
          ttsTournament: true,
          pairing: data.pairing,
          banner: data.banner,
        }
      };

      console.log(params);

      try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
      } catch (e) {
        console.log(e);
        return failure({ status: false });
      }
    } else {
      const params = {
        TableName: process.env.tournamentInfo,
        Item: {
          tournamentId: unique,
          adminId: event.requestContext.identity.cognitoIdentityId,
          tournamentName: data.tournamentName,
          date: data.date,
          end: data.end,
          allowSignup: data.allowSignup,
          maxPlayers: data.maxPlayers,
          ttsTournament: true,
          info: data.info,
          pairing: data.pairing,
          banner: data.banner,
        }
      };

      console.log(params);

      try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
      } catch (e) {
        console.log(e);
        return failure({ status: false });
      }
    }
  } else {
    if (data.info == "") {
      const params = {
        TableName: process.env.tournamentInfo,
        Item: {
          tournamentId: unique,
          adminId: event.requestContext.identity.cognitoIdentityId,
          tournamentName: data.tournamentName,
          location: data.location,
          date: data.date,
          end: data.end,
          allowSignup: data.allowSignup,
          maxPlayers: data.maxPlayers,
          country: data.country,
          region: data.region,
          ttsTournament: false,
          pairing: data.pairing,
          banner: data.banner,
        }
      };

      console.log(params);

      try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
      } catch (e) {
        console.log(e);
        return failure({ status: false });
      }
    } else {
      const params = {
        TableName: process.env.tournamentInfo,
        Item: {
          tournamentId: unique,
          adminId: event.requestContext.identity.cognitoIdentityId,
          tournamentName: data.tournamentName,
          location: data.location,
          date: data.date,
          end: data.end,
          allowSignup: data.allowSignup,
          maxPlayers: data.maxPlayers,
          country: data.country,
          region: data.region,
          info: data.info,
          ttsTournament: false,
          pairing: data.pairing,
          banner: data.banner,
        }
      };

      console.log(params);

      try {
        await dynamoDbLib.call("put", params);
        return success(params.Item);
      } catch (e) {
        console.log(e);
        return failure({ status: false });
      }
    }
  }
}