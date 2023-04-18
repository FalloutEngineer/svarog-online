const User = require('../models/user');
const Hero = require('../class/Hero');

module.exports = (bot) =>{
    const module = {};

    const allHeroes = [];

    module.initialize = async () =>{
        const allUsers = await User.find({});
        allUsers.forEach(user =>{
            if(user.hero){
                const newHero = new Hero(user, bot);
                allHeroes.push(newHero);
            }
        });
    }

    module.getHeroes = function(){
        return allHeroes;
    }

    module.getHeroByUserId = function(userId){
        const index = allHeroes.findIndex(arrayHero => arrayHero.playerId === userId);
        if(index !== -1){
            const hero = allHeroes[index];
            return hero;
        }
        return null;
    }

    module.addToPool = (hero) =>{
        const userHero = module.getHeroByUserId(hero.playerId);
        const isHeroInPool = userHero != null;
        if(hero instanceof Hero && !isHeroInPool){
            allHeroes.push(hero);
            console.log('Hero successfully subscribed');
        }else{
            console.log('Invalid hero!');
        }
    }

    module.removeFromPoolByUserId = (userId) =>{
        const index = allHeroes.findIndex(arrayHero => arrayHero.playerId === userId);
        let heroName;
        if(index !== -1){
                heroName = allHeroes[index].name
                allHeroes.splice(index, 1);
                console.log(`Hero ${heroName} successfully removed!`);
            }else{
                console.log('Hero not in list!');
            }
    }

    return module;
}