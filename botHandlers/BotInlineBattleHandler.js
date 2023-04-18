const getUser = require('../functions/getUser');

module.exports = function(bot, heroesPool, mobsPool, battlesPool){
    let module = {};

    module.initialize = () => {
        bot.on("inline_query", async query =>{
            const userId = query.from.id;
            const user = await getUser(userId);
        
            let answer;
        })
    }

    
}