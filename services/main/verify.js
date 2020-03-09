import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    console.log(event);

    const data = JSON.parse(event.body);
    console.log(data);

    if (data === 1) {
        const params = {
        TableName: process.env.tableHistory,
        Key: {
            gameId: event.pathParameters.id,
        },
        UpdateExpression: "SET auth1 = :auth1",
        ExpressionAttributeValues: {
            ":auth1": true,
        },
        };

        try{
        await dynamoDbLib.call("update", params);
        return success(true);
    } catch (e) {
        console.log(e);
        return failure(e);
    }
    }

    if (data === 2) {
        const params = {
        TableName: process.env.tableHistory,
        Key: {
            gameId: event.pathParameters.id,
        },
        UpdateExpression: "SET auth2 = :auth2",
        ExpressionAttributeValues: {
            ":auth2": true,
        },
        };

        try{
        await dynamoDbLib.call("update", params);
        return success(true);
    } catch (e) {
        console.log(e);
        return failure(e);
    }
    }
}