const user = require("../models/user");
const Battle = require("../class/Battle");

module.exports = class BattleArticle{
    constructor(user, secondOpponent, id, bot){
        this._battleId = null;
        this._id = id;
        this._selectedRewardId = 0;
        this._user = user;
        this._secondOpponent = secondOpponent;
        this._bot = bot;
        this._step = 0;
        this._hp = 100;
        this._articleId = null;
        this._battleMessage = {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: 'Використати {weaponName}', callback_data: '{"q": "battle_control", "a": "weapon"}'},
                    ],
                    [
                        {text: 'Навички', callback_data: '{"q": "battle_control", "a": "skills"}'},
                        {text: 'Предмети', callback_data: '{"q": "battle_control", "a": "items"}'},
                    ],
                    [
                        {text: 'Уклонитись (probability)', callback_data: '{"q": "battle_control", "a": "dodge"}'},
                        
                    ],
                    [
                        {text: 'Втікти (probability)', callback_data: '{"q": "battle_control", "a": "escape"}'}
                    ]
                ]
            },
        }
        this._endMessage = {
            input_message_content:{
                message_text:
`<b>[${this.title}]</b> [Перемога!]
Побідітіль: ${this.winnerName}
--------------------Нагорода--------------------
${this.award}
`,
                parse_mode: 'HTML'
            },
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: '⬆️', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '⬇️', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '🖐 Взяти', callback_data: '{"q": "award_control", "a": "take"}'},
                    ],
                    [
                        {text: '✋🤚 Взяти все', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                    ],
                    [
                        {text: '🚪 Завершити бій', callback_data: '{"q": "battle_control", "a": "end"}'},
                    ]
                ]
            },
        }
        this._article = {
            input_message_content: this._battleMessage.input_message_content,
            reply_markup: this._battleMessage.reply_markup,
        };
    }

    get winnerName(){
        return this._user.hero.name;
    }

    get battleStage(){

    }

    get resultsStage(){

    }

    get _selectedRewardSymbol(){
        return `🫴`;
    }

    get history(){
        return 'Тут буде історія'
    }

    get title(){
        return 'Заголовок'
    }

    get step(){
        return `Шаг 1`
    }

    get articleId(){
        return this._articleId;
    }

    get unconditionalRewards(){
        return ['50xp', '100💰']
    }

    get conditionalRewards(){
        return ['Рваний ботінок', 'Палка']
    }

    get selectedRewardId(){
        return this._selectedRewardId;
    }

    get award(){
        let unconditionalRewards = ``;
        this.unconditionalRewards.forEach((reward, index) =>{
            unconditionalRewards += `${reward}
`});
        let conditionalRewards = ``;
        this.conditionalRewards.forEach((reward, index) =>{
            if(this.selectedRewardId == index){
                conditionalRewards += this._selectedRewardSymbol;
            }
            conditionalRewards += `${reward}
`
        });

        let rewardMessage = `${unconditionalRewards}
---Предмети---
${conditionalRewards}`

        return rewardMessage;
    }

    // get(){
    //     return this._article;
    // }

    set step(step){
        this._step = step;
    }

    set user(us){
        this._user = us;
    }

    formArticleText(){
        return `<b>[${this.title}]</b> [Крок: ${this._step}]
[${this._user.lvl}] ${this._user.name} [${this._user.hp}/${this._user.maxHP}]❤️
[${this._secondOpponent.lvl}] ${this._secondOpponent.name} [${this._secondOpponent.hp}/${this._secondOpponent.maxHP}]❤️
--------------------Події--------------------
${this.history}`;
    }

    updateMessage(){
        this._bot.editMessageText(
            this.formArticleText(), 
            {inline_message_id: this._id, parse_mode: "HTML"});
    }
}

// `[Ограблєніє]
// 🔸 [${user.hero.lvl}] ${user.hero.name} [${user.hero.currentHP}/${user.hero.maxHP}]❤️
// 🌀 [1] Ящюр [40/50]❤️ 
// --------------------Дії--------------------
// Бойчінко: Вдарив [меч 1000 істин] в груди
// Ящір: Отримав 10 урона
// Ящір: Знепритомнів
// `