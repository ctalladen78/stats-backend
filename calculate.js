export async function main () {
    ranking1 = 10^((playerRanking1+factionRanking1)/400);
    ranking2 = 10^((playerRanking2+factionRanking2)/400);

    winChance = ranking1/(ranking1 + ranking2);

    kFactor = 50;
    kFaction = 10;

    if (gameResult == "player 1 minor win") {
        ratingChange = kFactor*(1 - winChance)*0.5;
        factionChange = kFaction*(1 - winChance)*0.5;
    }
    if (gameResult == "player 1 major win") {
        ratingChange = kFactor*(1 - winChance)*0.75;
        factionChange = kFaction*(1 - winChance)*0.75;
    }
    if (gameResult == "player 1 crushing win") {
        ratingChange = kFactor*(1 - winChance);
        factionChange = kFaction*(1 - winChance);
    }
    if (gameResult == "player 2 minor win") {
        ratingChange = kFactor*(winChance)*0.5;
        factionChange = kFaction*(winChance)*0.5;
    }
    if (gameResult == "player 2 major win") {
        ratingChange = kFactor*(winChance)*0.75;
        factionChange = kFaction*(winChance)*0.75; 
    }
    if (gameResult == "player 2 crushing win") {
        ratingChange = kFactor*(winChance);
        factionChange = kFaction*(winChance);
    }
    

    return (ranking1 , ranking2, winChance, ratingChange, factionChange)
}