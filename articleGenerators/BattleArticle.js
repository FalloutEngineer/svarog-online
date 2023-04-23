module.exports = class BattleArticle{
    constructor(firstOpponent, secondOpponent, id, bot){
        this._battleId = null;
        this._id = id;
        this._selectedRewardId = 0;
        this._firstOpponent = firstOpponent;
        this._secondOpponent = secondOpponent;
        this._bot = bot;
        this._step = 0;
        this._hp = 100;
        this._winner = firstOpponent;
        this._articleId = null;
        this._history = [];
        this._currentActor = firstOpponent;
        this._nextActor = secondOpponent;
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

    get winner(){
        return this._winner;
    }

    get battleStage(){

    }

    get resultsStage(){

    }

    get _selectedRewardSymbol(){
        return `🫴`;
    }

    get history(){
        return this._history;
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

    set step(step){
        this._step = step;
    }

    set firstOpponent(us){
        this._firstOpponent = us;
    }

    get historyLastActions(){
        return this.history
    }

    get currentActor(){
        return this._currentActor;
    }

    get nextActor(){
        return this._nextActor;
    }

    set nextActor(next){
        this._nextActor = next;
    }

    set currentActor(currentActor){
        this._currentActor = currentActor;
    }

    formArticleText(){
        return `<b>[${this.title}]</b> [Крок: ${this._step}]
До закінчення крока: 01:00
${this.currentActor.name == this._firstOpponent.name ? '🔸' : ''} [${this._firstOpponent.lvl}] ${this._firstOpponent.name} [${this._firstOpponent.hp}/${this._firstOpponent.maxHP}]❤️
${this.currentActor.name == this._secondOpponent.name ? '🔸' : ''} [${this._secondOpponent.lvl}] ${this._secondOpponent.name} [${this._secondOpponent.hp}/${this._secondOpponent.maxHP}]❤️
--------------------Події--------------------
${this.history.slice(-5).map(el => `${el}\n`).join('')}`;
    }

    updateMessage(){
        this._bot.editMessageText(
            this.formArticleText(), 
            {inline_message_id: this._id, parse_mode: "HTML", reply_markup:{
                inline_keyboard:[
                    [
                        {text: `🫁 Витривалість: 100/100`, callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: `${this.nextActor.name} [${this.nextActor.hp}/${this.nextActor.maxHP}]`, callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '⚪️', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '😐', callback_data: '{"q": "award_control", "a": "down"}'},
                        {text: '⚪️', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '🗡', callback_data: '{"q": "award_control", "a": "take"}'},
                        {text: '❤️', callback_data: '{"q": "award_control", "a": "take"}'},
                        {text: '🛡', callback_data: '{"q": "award_control", "a": "take"}'},
                    ],
                    [
                        {text: '⚪️', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                        {text: '🦵🦵', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                        {text: '⚪️', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                    ],
                    [
                        {text: '⬅️ Назад', callback_data: '{"q": "battle_control", "a": "end"}'},
                    ]

                    // [
                    //     {text: `🫁 Витривалість: 100/100`, callback_data: '{"q": "award_control", "a": "down"}'},
                    // ],
                    // [
                    //     {text: `❇️ Ефекти`, callback_data: '{"q": "award_control", "a": "down"}'},
                    //     {text: `❔ Характеристики`, callback_data: '{"q": "award_control", "a": "down"}'},
                    // ],
                    // [
                    //     {text: '🗡 Меч хряка', callback_data: '{"q": "award_control", "a": "up"}'},
                    //     {text: '🛡 Щіт "Оу"', callback_data: '{"q": "award_control", "a": "down"}'},
                    // ],
                    // [
                    //     {text: '✨ Вміння', callback_data: '{"q": "award_control", "a": "take"}'},
                    // ],
                    // [
                    //     {text: '🧪 Зілля', callback_data: '{"q": "award_control", "a": "up"}'},
                    //     {text: '👝 Предмети', callback_data: '{"q": "award_control", "a": "take"}'},
                    // ],
                    // [
                    //     {text: '🏃 Втікти (33%)', callback_data: '{"q": "battle_control", "a": "end"}'},
                    //     {text: '🚪 Здатись', callback_data: '{"q": "battle_control", "a": "end"}'},
                    // ]
                ]
            },});
    }

    updateEndMessage(){
        this._bot.editMessageText(
            this.formEndGameMessageText(), 
            {inline_message_id: this._id, parse_mode: "HTML", reply_markup:{
                inline_keyboard:[
                    [
                        {text: 'СТОРІНКА 1 ІЗ 5', callback_data: '{"q": "award_control", "a": "up"}'},
                    ],
                    [
                        {text: '🗡 МЕЧ СЛАВИ', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '🖐 Взяти', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '👞 РВАНИЙ БОТІНОК ІСТІНИ', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '🖐 Взяти', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '🪡 ІГЛА КОЩЄЯ', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '🖐 Взяти', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '🪖 ШЛЄМ ГОЛОВАСТІКА', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '🖐 Взяти', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '🧢 КЄПКА ПІДАРАШКИ', callback_data: '{"q": "award_control", "a": "up"}'},
                        {text: '🖐 Взяти', callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: '⬅️', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                        {text: '➡️', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                    ],
                    [
                        {text: '✋🤚 Взяти все', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                    ],
                    [
                        {text: '🚪 Завершити бій', callback_data: '{"q": "battle_control", "a": "end"}'},
                    ]
                ]
            },});
    }

    formEndGameMessageText(){
        return `<b>[${this.title}]</b>
Переможець: [${this.winner.lvl}] ${this.winner.name} [${this.winner.hp}/${this.winner.maxHP}]❤️!
--------------------Нагорода--------------------
$unconditionalReward
`
    }

    appendToHistory(text){
        this._history.push(text)
    }
}

// `[Ограблєніє]
// 🔸 [${firstOpponent.hero.lvl}] ${firstOpponent.hero.name} [${firstOpponent.hero.currentHP}/${firstOpponent.hero.maxHP}]❤️
// 🌀 [1] Ящюр [40/50]❤️ 
// --------------------Дії--------------------
// Бойчінко: Вдарив [меч 1000 істин] в груди
// Ящір: Отримав 10 урона
// Ящір: Знепритомнів
// `