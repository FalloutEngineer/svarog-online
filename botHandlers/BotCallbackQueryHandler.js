const UserRegistration = require('../handlers/UserRegistration');
const getUser = require('../functions/getUser');
const isUserRegistered = require('../functions/isUserRegistered');
const Mob = require('../class/Mob');
const Battle = require('../class/Battle');
const mobsSettings = require('../default-values/mobs.json');

module.exports = function(bot, botStartHandler, heroesPool, mobsPool, battlesPool){
    bot.on('callback_query', async cb => {
        const data = JSON.parse(cb.data);

        if(data.q){
            if(data.q == 'confirm_name'){
            
                if(data.a == true){
                    botStartHandler.userConfirmedCallback(cb.from.id, cb.id);
                }else{
                    botStartHandler.userDeclinedCallback(cb.from.id, cb.id);
                }
            }
        
            // if(data.t == 'g_name'){
            //     UserRegistration.handle(cb, data);
            // }
    
            if(data.q == 'battle' && data.a == 'yashur'){
                console.log(cb);
                const isThisUserRegistered = await isUserRegistered(cb.from.id);
                if(isThisUserRegistered){
                    const playerHero = heroesPool.getHeroByUserId(cb.from.id);
    
                    const lizardSettings = mobsSettings.lizard;
                    const lizard = new Mob(lizardSettings);
                    mobsPool.addToPool(lizard);
    
                    const mob = mobsPool.getMobById(lizard.id);
                    const battle = new Battle(playerHero, mob, cb.inline_message_id);
    
                    battlesPool.addToPool(battle, cb.from.id);
    
                    battle.start();
                    await battle.battle();
    
                    if(battle.winner instanceof Mob){
                        mobsPool.removeFromPoolByMobId(battle.loser.id);
                    }
    
                    console.log(`І побідітіль: ${battle.winner.name}`);
    
                    battlesPool.removeFromPoolByBattleId(cb.inline_message_id);
    
                }else{
                    console.log('нє');
                }
            }
    
            if(data.q == 'b_a'){
                const battle = battlesPool.getBattleById(cb.from.id);
                if(battle){
                    const currentActor = heroesPool.getHeroByUserId(cb.from.id);
                    const nextActor = mobsPool.getMobById(0); //TODO: TAKE MOB FROM BATTLE;
                    if(cb.from.id == battle.currentActor.playerId){
                        battle.performAction(data.q, data.a);
                    }else{
                        bot.answerCallbackQuery(cb.id, {text: "Не твій крок, брательнік"});
                    }
                }else{
                    bot.answerCallbackQuery(cb.id, {text: "Не твій крок, брательнік"});
                }
            }
    
            if(data.q == 'main_battle' || data.q == 'battle_control' || data.q == 'friendly_control'){
                const battle = battlesPool.getBattleById(cb.from.id);
                    if(battle){
                        const currentActor = heroesPool.getHeroByUserId(cb.from.id);
                        const nextActor = mobsPool.getMobById(0); //TODO: TAKE MOB FROM BATTLE;
                        if(cb.from.id == battle.currentActor.playerId){
                            battle.performMenuAction(data.q, data.a);
                        }else{
                            bot.answerCallbackQuery(cb.id, {text: "Не твій крок, брательнік"});
                        }
                    }else{
                        bot.answerCallbackQuery(cb.id, {text: "Не твій крок, брательнік"});
                    }
            }
        }else{
            bot.answerCallbackQuery(cb.id);
        }
    });
};

