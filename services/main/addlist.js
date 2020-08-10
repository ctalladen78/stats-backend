import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    console.log(event);
    const data = JSON.parse(event.body);
    console.log(data);
    console.log(data.player);
    console.log(data.list);

    // if (data.player === 1) {
        console.log("HERE");
        const params = {
        TableName: process.env.tableHistory,
        Key: {
            gameId: event.pathParameters.id,
        },
        UpdateExpression: "SET list1Location = :list1Location",
        ExpressionAttributeValues: {
            ":list1Location": data.list,
        },
        };
        console.log(params);

        try{
        await dynamoDbLib.call("update", params);
        return success(true);
        } catch (e) {
        console.log(e);
        return failure(e);
        }
    // }

    // if (data.player === 2) {
    //     const params = {
    //     TableName: process.env.tableHistory,
    //     Key: {
    //         gameId: event.pathParameters.id,
    //     },
    //     UpdateExpression: "SET list2Location = :list2Location",
    //     ExpressionAttributeValues: {
    //         ":list2Location": data.list,
    //     },
    //     };

    //     try{
    //     await dynamoDbLib.call("update", params);
    //     return success(true);
    //     } catch (e) {
    //     console.log(e);
    //     return failure(e);
    //     }
    // }
}