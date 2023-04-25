const Battle = require('../class/Battle');

module.exports = () =>{
    const module = {};

    const allBattles = [];

    module.getBattles = function(){
        return allBattles;
    }

    module.getBattleById = function(playerId){
        const index = allBattles.findIndex(arrayBattle => arrayBattle.id === playerId);
        if(index !== -1){
            const battle = allBattles[index];
            return battle;
        }
        return null;
    }

    //GET BATTLE BY USER

    module.addToPool = (battle, playerId) =>{
        console.log(allBattles.length);
        battle.id = playerId;
        const oldBattle = module.getBattleById(battle.id);
        const isBattleInPool = oldBattle != null;
        if(battle instanceof Battle && !isBattleInPool){
            allBattles.push(battle);
            console.log('Battle successfully subscribed');
        }else{
            console.log('Invalid battle!');
        }
    }

    module.removeFromPoolByBattleId = (battleId) =>{
        console.log(battleId);
        console.log(allBattles[0].id);
        const index = allBattles.findIndex(arrayBattle => arrayBattle.id === battleId);
        let battleName;
        if(index !== -1){
                battleName = allBattles[index].id
                allBattles.splice(index, 1);
                console.log(`Battle ${battleName} successfully removed!`);
            }else{
                console.log('Battle not in list!');
            }
    }

    return module;
}