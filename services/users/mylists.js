import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    const params = {
        TableName: process.env.savedLists,
        FilterExpression: "playerId = :playerId",
        ExpressionAttributeValues: {
            ":playerId": event.pathParameters.id
        },
    };

    console.log(params);

    try {
        const result = await dynamoDbLib.call("scan", params);
        console.log(result);
        console.log(result.Items);
        return success(result.Items);
    } catch (e) {
        console.log(e);
        return failure({ status: false });
    }
}