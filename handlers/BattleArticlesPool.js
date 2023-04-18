const BattleArticle = require('../articleGenerators/BattleArticle');

module.exports = () =>{
    const module = {};

    const allBattles = [];

    module.getBattles = function(){
        return allBattles;
    }

    module.getBattleById = function(battleId){
        const index = allBattles.findIndex(arrayBattle => arrayBattle.id === battleId);
        if(index !== -1){
            const battle = allBattles[index];
            return battle;
        }
        return null;
    }

    module.addToPool = (battle) =>{
        console.log(allBattles.length);
        battle.id = allBattles.length;
        const oldBattle = module.getBattleById(battle.id);
        const isBattleInPool = oldBattle != null;
        if(battle instanceof BattleArticle && !isBattleInPool){
            allBattles.push(battle);
            console.log('BattleArticle successfully subscribed');
        }else{
            console.log('Invalid battle!');
        }
    }

    module.removeFromPoolByBattleId = (battleId) =>{
        const index = allBattles.findIndex(arrayBattle => arrayBattle.id === battleId);
        let battleName;
        if(index !== -1){
                battleName = allBattles[index].name
                allBattles.splice(index, 1);
                console.log(`Battle ${battleName} successfully removed!`);
            }else{
                console.log('Battle not in list!');
            }
    }

    return module;
}