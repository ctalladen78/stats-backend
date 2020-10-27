import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

const calculateRanking = (factionRanking1, factionRanking2, commander1Ranking, commander2Ranking) => {
    console.log(factionRanking1, factionRanking2, commander1Ranking, commander2Ranking);
    const ranking1 = Math.pow(10, (1500 + factionRanking1 + commander1Ranking)/400);
    const ranking2 = Math.pow(10, (1500 + factionRanking2 + commander2Ranking)/400);

    const winChance = ranking1/(ranking1 + ranking2);
    console.log(winChance);

    return (winChance);
};

const findFactionRank = (faction) => {
  const params = {
    TableName: process.env.factionProfile,
    Key: {
      factionId: faction
    }
  };
  return params;
};

const findCommanderRank = (commander, faction) => {
  const params = {
    TableName: process.env.commanderProfile,
    Key: {
      commanderId: commander,
      factionId: faction
    }
  };
  return params;
};



export async function main(event) {
    const data = JSON.parse(event.body);
    console.log(data);
    try {
        const faction1Profile = await dynamoDbLib.call("get", findFactionRank(data.faction1));  // call faction 1 data from table
        console.log(faction1Profile);
        const faction2Profile = await dynamoDbLib.call("get", findFactionRank(data.faction2));  // call faction 2 data from table
        console.log(faction2Profile);
        const commander1Profile = await dynamoDbLib.call("get", findCommanderRank(data.commander1, data.faction1));  // call faction 1 data from table
        const commander2Profile = await dynamoDbLib.call("get", findCommanderRank(data.commander2, data.faction2));  // call faction 2 data from table
        const eloFactor = calculateRanking(faction1Profile.Item.ranking, faction2Profile.Item.ranking, commander1Profile.Item.ranking, commander2Profile.Item.ranking);
        console.log(eloFactor);
    return success(eloFactor);
  } catch (e) {
    console.log(e);
    return failure(e);
  }
}