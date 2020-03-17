import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from "uuid";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const unique = uuid.v1();

  console.log(data);

  if (data.info == "") {
    const params = {
      TableName: process.env.tournamentInfo,
      Item: {
        tournamentId: unique,
        adminId: event.requestContext.identity.cognitoIdentityId,
        tournamentName: data.tournamentName,
        location: data.location,
        date: data.date,
        country: data.country,
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
        country: data.country,
        info: data.info,
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