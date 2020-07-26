import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from "uuid";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  const unique = uuid.v1();

  console.log(data);

  const params = {
    TableName: process.env.savedLists,
    Item: {
        listId: unique,
        name: data.name,
        playerId: event.requestContext.identity.cognitoIdentityId,
        commander: data.commander,
        units: data.units,
        ncus: data.ncus,
        list: data.list,
        activations: data.activations,
        faction: data.faction,
        points: data.points,
        version: "1.5.1",
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    return success(params.Item);
  } catch (e) {
    console.log(e);
    return failure({ status: false });
  }
}