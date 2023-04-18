const Mob = require('../class/Mob');

module.exports = () =>{
    const module = {};

    const allMobs = [];

    // module.initialize = async () =>{
    //     const allMobs = await Mob.find({});
    //     allMobs.forEach(mob =>{
    //         const newMob = new Mob(user);
    //         allMobs.push(newMob);
    //     });
    // }

    module.getMobs = function(){
        return allMobs;
    }

    module.getMobById = function(userId){
        const index = allMobs.findIndex(arrayMob => arrayMob.id === userId);
        if(index !== -1){
            const mob = allMobs[index];
            return mob;
        }
        return null;
    }

    module.addToPool = (mob) =>{
        console.log(allMobs.length);
        mob.id = allMobs.length;
        const oldMob = module.getMobById(mob.id);
        const isMobInPool = oldMob != null;
        if(mob instanceof Mob && !isMobInPool){
            allMobs.push(mob);
            console.log('Mob successfully subscribed');
        }else{
            console.log('Invalid mob!');
        }
    }

    module.removeFromPoolByMobId = (mobId) =>{
        const index = allMobs.findIndex(arrayMob => arrayMob.id === mobId);
        let mobName;
        if(index !== -1){
                mobName = allMobs[index].name
                allMobs.splice(index, 1);
                console.log(`Mob ${mobName} successfully removed!`);
            }else{
                console.log('Mob not in list!');
            }
    }

    return module;
}