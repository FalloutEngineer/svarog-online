const gameSettings = require('../default-values/game-settings.json');

module.exports = function(heroesPool){
    const module = {};

    let isInitialised = false;


    module.initialize = async function() {
        setRegenerationInterval();
        console.log('Regenerator initialized!');
    }

    const regenerateAll = () =>{
        const heroes = heroesPool.getHeroes();
        heroes.forEach(hero => {
            hero.regenerate();
        });
    }

    const setRegenerationInterval = () =>{
        const intervalInMS = gameSettings.regenerationIntervalS * 1000;
        const interval = setInterval(regenerateAll, intervalInMS);
    }

    return module;
}