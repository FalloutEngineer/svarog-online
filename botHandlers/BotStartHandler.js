const getUser = require('../functions/getUser');
const isBotPM = require('../functions/isBotPM');
const User = require('../models/user');
const isUserExists = require('../functions/isUserExists');
const getUserRegistrationStage = require('../functions/getUserRegistrationStage');
const Hero = require('../class/Hero');


module.exports = function(bot, pool){
    const UserRegistration = require('../handlers/UserRegistration.js')(bot);

    let module = {};

    module.initialize = ()=>{
        bot.onText(/\/start/, async (msg, match) => {
            const userExits = await isUserExists(msg.from.id);
            if(isBotPM(msg)){
                if(userExits){
                    const user = await getUser(msg.from.id);
                    if(user.hero){
                        if(user.hero.name != ''){
                            let resp = `Вітаю тебе знову, ${user.hero.name}!`
                            bot.sendMessage(msg.chat.id, resp);
                        }
                    }
                }else{
                    let resp;
            
                        let partial;
                    
                        if(msg.from.first_name && msg.from.last_name){
                            partial = msg.from.first_name + ' ' + msg.from.last_name
                        }else{
                            partial = msg.from.username;
                        }
        
                        const answer = await UserRegistration.tryCreateUser(msg.from.id);
        
                        console.log(answer);
        
                        if(answer.isError){
                            resp = `Сталася помилка. Код: ${answer.message}`
                            console.log(answer);
                        }else{
                            resp = 
    `Привіт, ${partial}, я допоможу тобі розібратись з грою.
    Для початку нам треба створити героя.
    Напиши його ім'я нижче.
    Ім'я повинно бути не менше 5 та не більше 16 символів`
                        }
                        bot.sendMessage(msg.chat.id, resp);
                        const newUser = await User.findOneAndUpdate({id: msg.from.id},{'$set': {'util.registrationStage': 1}});
                }
            }else{

            }
        });


        bot.onText(/(.*?)/, async (msg, match) =>{
            if(isBotPM(msg)){
                const user = await getUser(msg.from.id);
                if(user){
                    if(user.util.registrationStage == 1){
                        if(msg.text.length < 5 || msg.text.length > 16){
                            bot.sendMessage(msg.from.id, `Твоє ім'я повинно бути більшим за 5 символів та меншим за 16`);
                        }
                        const newUser = await User.findOneAndUpdate({id: msg.from.id},{'$set':{'hero.name': msg.text}});
                        confirmUserMessage(msg);
                    }
                }
            }else{
                console.log(msg);
            }
        })
    }

    

    async function confirmUserMessage(msg){
        // const newUser = await User.findOneAndUpdate({id: msg.from.id},{util: {registrationStage: 2}});
        bot.sendMessage(msg.chat.id, 
`Ти дісйно хочеш назвати героя ${msg.text}?
Якщо ні, то напиши нове ім'я`
, {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: "Ні", callback_data: `{"q": "confirm_name", "a": false}`},
                        {text: "Так", callback_data: `{"q": "confirm_name", "a": true}`},
                        {text: "Не хочу", callback_data: `{"q": "confirm_name", "a": false}`}
                    ]
                ],
            }
        });
    }

    async function userConfirmed(userId, callbackId) {
        try{
            const newUser = await User.findOneAndUpdate({id: userId},{'$set': {'util.registrationStage': 2}});
            const updatedUser = await getUser(userId);
            const playerHero = new Hero(updatedUser);
            pool.addToPool(playerHero);
            
            bot.answerCallbackQuery(callbackId, {text: `Героя створено! ${playerHero.name}`});
            bot.sendMessage(userId, `Твого героя створено: Name: ${playerHero.name}, HP: ${playerHero.maxHP}`);
        }catch(e){
            bot.answerCallbackQuery(callbackId, {text: `Виникла помилка! ${e.code}`});
        }
    }

    async function userDeclined(userId, callbackId){
        bot.answerCallbackQuery(callbackId, {text: `Окей, напиши нове ім'я`}); //TODO:
    }

    module.userConfirmedCallback = async function(userId, callbackId){
        const registrationStage = await getUserRegistrationStage(userId);
        if(registrationStage == 1){
            userConfirmed(userId, callbackId);
        }else{
            bot.answerCallbackQuery(callbackId, {text: `Упс, щось сталось не так!`});
        }
    }

    module.userDeclinedCallback = async function(userId, callbackId){
        const registrationStage = await getUserRegistrationStage(userId);
        if(registrationStage == 1){
            userDeclined(userId, callbackId);
        }else{
            bot.answerCallbackQuery(callbackId, {text: `Упс, щось сталось не так!`});
        }
    }
    
    return module;
};