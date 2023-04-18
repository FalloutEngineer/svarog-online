const Hero = require("../class/Hero");
const Mob = require("../class/Mob");
const Battle = require("../class/Battle");
const isUserRegistered = require("../functions/isUserRegistered");
const getUser = require("../functions/getUser");
const mobsSettings = require('../default-values/mobs.json');


module.exports = function(bot, pool, mobPool, battlesPool) {
    // bot.onText(/в/i, async (msg)=>{
    //     if(!msg.from.is_bot){
    //         const isThisUserRegistered = await isUserRegistered(msg.from.id);
    //         if(isThisUserRegistered){
    //             const playerHero = pool.getHeroByUserId(msg.from.id);
    //             playerHero.takeDamage(10);
    //         }else{
    //             console.log('нє');
    //         }
    //     }
    // })

    // bot.onText(/х/i, async (msg)=>{
    //     if(!msg.from.is_bot){
    //         const isThisUserRegistered = await isUserRegistered(msg.from.id);
    //         if(isThisUserRegistered){
    //             const playerHero = pool.getHeroByUserId(msg.from.id);
    //             playerHero.heal(1488);
    //         }else{
    //             console.log('нє');
    //         }
    //     }
    // })

    // bot.onText(/я/i, async (msg)=>{
    //     if(!msg.from.is_bot){
    //         const isThisUserRegistered = await isUserRegistered(msg.from.id);
    //         if(isThisUserRegistered){
                // const lizardSettings = mobsSettings.lizard;
                // const lizard = new Mob(lizardSettings);
                // mobPool.addToPool(lizard);
    //             console.log(mobPool.getMobs());

    //         }else{
    //             console.log('нє');
    //         }
    //     }
    // })

    // bot.onText(/й/i, async (msg)=>{
    //     if(!msg.from.is_bot){
    //         const isThisUserRegistered = await isUserRegistered(msg.from.id);
    //         if(isThisUserRegistered){
    //             const mob = mobPool.getMobById(0);
    //             console.log(mob);
    //             mob.takeDamage(10);
    //             console.log(mob.hp);
    //         }else{
    //             console.log('нє');
    //         }
    //     }
    // })

    // bot.onText(/биця/i, async (msg)=>{
    //     if(!msg.from.is_bot){
    //         const isThisUserRegistered = await isUserRegistered(msg.from.id);
    //         if(isThisUserRegistered){
    //             const playerHero = pool.getHeroByUserId(msg.from.id);

    //             const lizardSettings = mobsSettings.lizard;
    //             const lizard = new Mob(lizardSettings);
    //             mobPool.addToPool(lizard);

    //             const mob = mobPool.getMobById(lizard.id);
    //             const battle = new Battle(playerHero, mob);

                

    //             battlesPool.addToPool(battle);

    //             battle.start();
    //             await battle.autoBattle();

    //             if(battle.winner instanceof Mob){
    //                 mobPool.removeFromPoolByMobId(battle.loser.id);
    //             }

    //             console.log(`І побідітіль: ${battle.winner.name}`);

    //         }else{
    //             console.log('нє');
    //         }
    //     }
    // })
}