import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
    var allResults = [];
    
    const params = {
        TableName: process.env.tableHistory,
    };

    const getAllData = async (params) => {

        console.log("Querying Table");
        let data = await dynamoDbLib.call("scan", params);

        if(data['Items'].length > 0) {
            allResults = [...allResults, ...data['Items']];
        }

        if (data.LastEvaluatedKey) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            return await getAllData(params);
        } else {
            return data;
        }
    };

    try {
        await getAllData(params);
        console.log("Processing Completed");
        return success(allResults);
    } catch (e) {
        return failure({ e });
    }
}