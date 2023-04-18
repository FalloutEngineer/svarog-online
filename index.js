require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TEST_API;
const bot = new TelegramBot(token, {polling: true});

const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose');
const createRegexp = new RegExp(/\/create (.+)/);

const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to database'));

const User = require('./models/user');



const heroesPool = require('./handlers/HeroesPool')(bot);
const mobsPool = require('./handlers/MobsPool')();
const battlesPool = require('./handlers/BattlesPool')();
const battleArticlesPool = require('./handlers/BattleArticlesPool')();
const botStartHandler = require('./botHandlers/BotStartHandler')(bot, heroesPool);

const botRegistrationHandler = require('./botHandlers/BotRegistrationHandler')(bot);
const botInlineQueryHandler = require('./botHandlers/BotInlineQueryHandler')(bot, battleArticlesPool, battlesPool);

const botCallbackQueryHandler = require('./botHandlers/BotCallbackQueryHandler')(bot, botStartHandler, heroesPool, mobsPool, battlesPool);
const heroRegenerationHandler = require('./handlers/HeroRegenerationHandler')(heroesPool);







const UserRegistration = require('./handlers/UserRegistration.js')(bot);

const testHandler = require('./botHandlers/testHandler')(bot, heroesPool, mobsPool, battlesPool);

const start = async() => {
    try{
        await mongoose.connect(process.env.TEST_DATABASE_URL, {useNewUrlParser: true});
        await heroesPool.initialize();
        botStartHandler.initialize();
        heroRegenerationHandler.initialize();
        console.log(`Server started on port ${PORT}`)
    }catch(e){
        console.log(e);
    }
}

start();