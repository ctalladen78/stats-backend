import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.savedLists,
        Key: {
            listId: data.listId
        },
        UpdateExpression: "REMOVE playerId",
    };

    console.log(params);

    try {
        await dynamoDbLib.call("update", params);
        return success();
    } catch (e) {
        console.log(e);
        return failure({ status: e });
    }
}