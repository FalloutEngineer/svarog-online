const User = require('../models/user');
const isUserExists = require('../functions/isUserExists');

const defaultHero = require('../default-values/hero.json');

module.exports = function(bot){
    let module = {};

    module.tryCreateUser = async function(userId){
        let answer = {
            user: null,
            message: null,
            code: null,
            isError: false
        }

        const user = new User({
            id: userId,
            hero:{
                name: "",
                maxHP: defaultHero.startMaxHP,
                currentHP: defaultHero.startHP,
                lvl: defaultHero.startLVL,
                xp: defaultHero.startXP
            },
            money: defaultHero.startMoney,
            util: {
                registrationStage: 0
            }
        })

        try{
            const newUser = await user.save();

            answer.user = newUser;
            answer.message = 'successful';
            answer.code = 100

            return answer;
        }catch(e){
            console.log(e);
            answer.isError = true;
            answer.message = e;
            answer.code = e.code;
            return answer;
        }
    }

    module.handle = async function (callback, data) {
        if(data.q){
            if(!(await isUserExists(callback.from.id))){
                if(data.q){
                    if(data.q.length > 3){
                        const user = new User({
                            id: callback.from.id,
                            hero:{
                                name: data.q,
                                maxHP: defaultHero.hp,
                                currentHP: defaultHero.hp,
                                lvl: 0,
                                xp: 0
                            },
                            money: 0
                        })
                    
                        try{
                            const newUser = await user.save();
            
                            bot.answerCallbackQuery(callback.id, {text: `Героя ${user.hero.name} створено!`});
                            bot.editMessageText(
`Ім'я: ${user.hero.name}
Здоров'я: ${user.hero.currentHP}/${user.hero.maxHP}❤️
LVL: ${user.hero.lvl}
XP: ${user.hero.xp}`, {inline_message_id: callback.inline_message_id});
                        }catch(e){
                            if(e.code = 11000){
                                bot.answerCallbackQuery(callback.id, {text: `В тебе вже є герой, дурбецало!`});
                            }else{
                                bot.answerCallbackQuery(callback.id, {text: `Упс, сталася помилка! ${e.code}`});
                            }
                            console.log(e);
                        }
                        }else{
                            bot.answerCallbackQuery(callback.id, {text: `Ім'я повинно бути більше за 3 символи`});
                        }
                        
                    }else{
                        bot.answerCallbackQuery(callback.id, {text: `Ти ж не назвав свиню!`});
                    }
            
                }else{
                    bot.answerCallbackQuery(callback.id, {text: `В тебе вже є герой, дурбецало!`});
                }
        }else if(data.q == false){
            answer = 'Ну ок, не створюємо';
            bot.answerCallbackQuery(callback.id, {text: 'Ну ок, не створюємо'});
        }
    }

    return module;
};