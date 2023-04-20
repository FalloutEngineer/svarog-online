const BattleArticle = require('../articleGenerators/BattleArticle');
const BattleArticlePlaceholder = require('../articleGenerators/BattleArticlePlaceholder');
const HeroArticle = require('../articleGenerators/HeroArticle');
const Battle = require('../class/Battle');
const Hero = require('../class/Hero');
const Mob = require('../class/Mob');
const mobDefaultValues = require('../default-values/mobs.json');
const getUser = require('../functions/getUser');

module.exports = function(bot, poolBattleArticles, battlesPool){
    bot.on('inline_query', async query =>{
        const userId = query.from.id;
        const user = await getUser(userId);
    
        let answer = [];
    
        if(user){
            // const hero = ;
            // const battle = ;

            let heroArticle = new HeroArticle(user, 1, bot);
            // let battleArticle = new BattleArticle(user, 2, userId, bot);
            let battleArticlePlaceholder = new BattleArticlePlaceholder();

            // heroArticle.setListener();
            // battleArticle.setListener();

            answer.push(heroArticle.get());
            answer.push(battleArticlePlaceholder.get());
        }else{
            const strQuery = JSON.stringify(query.query);
    
                const queryShort = query.query.split(' ')[1];
    
                answer = [{
                    id: "1",
                    type: "article",
                    title: "Створити героя?",
                    input_message_content:{
                        message_text: 
    `Ти дійсно хочеш назвати свого героя <b>${queryShort}</b>?
    
    В майбутньому це може коштувати монет`,
    
                        parse_mode: 'HTML'
                    },
                    reply_markup: {
                        inline_keyboard:[
                            [   
                                {text: "Ні, я передумав", callback_data: `{"t":"g_name", "q": false}`},
                            ],
                            [
                                {text: "Так", callback_data: `{"t":"g_name", "q": "${queryShort}"}`},
                            ],
                            [
                                {text: "Відмінити", callback_data: `{"t":"g_name", "q": false}`},
                            ],
                        ]
                    },
                    description: `${queryShort}`,
                }]
        }
    
        await bot.answerInlineQuery(query.id, answer, {cache_time: 0});
    });


    bot.on('chosen_inline_result', async chosen =>{
        const inlineMessageId = chosen.inline_message_id;

        console.log(chosen);
        if(chosen.result_id == 2){
            const battleUser = await getUser(chosen.from.id);

            console.log('here');
            const hero = new Hero(battleUser);
            const yashur = new Mob(mobDefaultValues.lizard);


            const battleArticle = new BattleArticle(battleUser, yashur, inlineMessageId, bot);
            const battle = new Battle(hero, yashur, battleArticle);

            battlesPool.addToPool(battle);

            battle.start();
            await battle.autoBattle();
        }
    })
};