import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event) {
    const data = JSON.parse(event.body);
    console.log(data);
    const params = {
        TableName: process.env.savedLists,
        Key: {
            listId: event.pathParameters.id,
            playerId: event.requestContext.identity.cognitoIdentityId,
        },
    };
    console.log(params);
    const params2 = {
        TableName: process.env.savedLists,
        Item: {
            listId: data.listId,
            name: data.name,
            playerId: "unattached",
            commander: data.commander,
            units: data.units,
            ncus: data.ncus,
            enemy: data.enemy,
            list: data.list,
            activations: data.activations,
            faction: data.faction,
            points: data.points,
            ks: data.ks,
            unreleased: data.unreleased,
            notFinal: data.notFinal,
            version: data.version,
            createdAt:data.createdAt,
        }
    };
    console.log(params2);
    try {
        await dynamoDbLib.call("delete", params);
        await dynamoDbLib.call("put", params2);
        return success();
    } catch (e) {
        console.log(e);
        return failure({ status: e });
    }

}