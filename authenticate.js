import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Key' defines the partition key and sort key of the item to be updated
    // - 'userId': Identity Pool identity id of the authenticated user
    // - 'noteId': path parameter
    Key: {
      gameId: event.pathParameters.id,
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET authenticated = :authenticated",
    ExpressionAttributeValues: {
      ":authenticated": data.authenticated,
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW"
  };

  // It now has to trigger a full recalculation of rankings
  // To achieve this it must; 
    //reset all rankings
    //call each result in the game history
    //calculate the change of each result in order and apply the change before moving on to the next

  try {
    await dynamoDbLib.call("authenticate", params);
    return success({ status: true });
  } catch (e) {
    return failure({ status: false });
  }
}