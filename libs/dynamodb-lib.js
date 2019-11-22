import AWS from "aws-sdk";

export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}

export function call2(action, params2) {
    const dynamoDb = new AWS.DynamoDB.DocumentClient();

    return dynamoDb[action](params2).promise();
  }