import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    console.log(event.body);
    
    const params = {
        TableName: process.env.savedLists,
        Key: {
            listId: event.pathParameters.id,
            playerId: event.requestContext.identity.cognitoIdentityId,
        },
    };

    console.log(params);

    try {
        await dynamoDbLib.call("delete", params);
        return success();
    } catch (e) {
        console.log(e);
        return failure({ status: e });
    }

}