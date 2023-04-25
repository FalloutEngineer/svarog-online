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
        this._currentBattleMessageFuncton =  this.formBattleText;
        this._currentBattleMarkupFunction = this.formMainBattleButtons;
        this._mainBattleMarkup = {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `🫁 Витривалість: ${this._currentActor.stamina}/${this._currentActor.maxStamina}`, callback_data: '{"q": "award_control", "a": "down"}'},
                    ],
                    [
                        {text: `❇️ Ефекти`, callback_data: '{"q": "main_battle", "a": "effects"}'},
                        {text: `❔ Характеристики`, callback_data: '{"q": "main_battle", "a": "charact"}'},
                    ],
                    [
                        {text: '🗡 Меч хряка', callback_data: '{"q": "main_battle", "a": "weapon"}'},
                        {text: '🛡 Щіт "Оу"', callback_data: '{"q": "main_battle", "a": "left_hand"}'},
                    ],
                    [
                        {text: '✨ Вміння', callback_data: '{"q": "main_battle", "a": "skills"}'},
                    ],
                    [
                        {text: '🧪 Зілля', callback_data: '{"q": "main_battle", "a": "up"}'},
                        {text: '👝 Предмети', callback_data: '{"q": "main_battle", "a": "take"}'},
                    ],
                    [
                        {text: '☑️ Завершити крок', callback_data: '{"q": "main_battle", "a": "end_step"}'},
                    ],
                    [
                        {text: '🏃 Втекти (33%)', callback_data: '{"q": "main_battle", "a": "run"}'},
                        {text: '🚪 Здатись', callback_data: '{"q": "main_battle", "a": "surrender"}'},
                    ]
                ]
            }
        }
        this._limbBattleMessage = {
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: `Зараз ходить: ${this._currentActor.name}`, callback_data: '{"q": "award_control", "a": ""}'},
                    ],
                    [
                        {text: `🫁 Витривалість: ${this._currentActor.stamina}/${this._currentActor.maxStamina}`, callback_data: ''},
                    ],
                    [
                        {text: '☑️ Завершити крок', callback_data: '{"q": "main_battle", "a": "end_step"}'},
                    ],
                    [
                        {text: `Твій ворог: ${this.nextActor.name} [${this.nextActor.hp}/${this.nextActor.maxHP}]`},
                    ],
                    [
                        {text: '', callback_data: ''},
                        {text: '😐', callback_data: ''},
                        {text: '', callback_data: ''},
                    ],
                    [
                        {text: '🗡', callback_data: '{"q": "award_control", "a": "take"}'},
                        {text: '❤️', callback_data: '{"q": "award_control", "a": "take"}'},
                        {text: '🛡', callback_data: '{"q": "award_control", "a": "take"}'},
                    ],
                    [
                        {text: '', callback_data: ''},
                        {text: '🦵🦵', callback_data: '{"q": "award_control", "a": "takeAll"}'},
                        {text: '', callback_data: ''},
                    ],
                    [
                        {text: '⬅️ Назад', callback_data: '{"q": "battle_control", "a": "end"}'},
                    ],
                ]
            }
        }
        this._endMessageText = {
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
            input_message_content: this.formBattleText(),
            reply_markup: this.formMainBattleButtons(),
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

    selectMainBattleMenu(){

    }

    selectLimbMenu(){

    }

    selectEndMenu(){

    }

    getMainButtons(){
        // return 
    }
    
    init(){
        this._currentBattleMessageFuncton = this.formBattleText;
        this._currentBattleMarkupFunction = this.formMainBattleButtons;
        // updateMessage()
    }

    selectMarkupFunction(markupFunction){
        this._currentBattleMarkupFunction = markupFunction;
    }

    selectMessageFunction(messageFunction){
        this._currentBattleMessageFuncton = messageFunction;
    }

    formBattleText(){
        return `<b>[${this.title}]</b> [Крок: ${this._step}]
До закінчення крока: 01:00
${this.currentActor.name == this._firstOpponent.name ? '🔸' : ''} [${this._firstOpponent.lvl}] ${this._firstOpponent.name} [${this._firstOpponent.hp}/${this._firstOpponent.maxHP}]❤️
${this.currentActor.name == this._secondOpponent.name ? '🔸' : ''} [${this._secondOpponent.lvl}] ${this._secondOpponent.name} [${this._secondOpponent.hp}/${this._secondOpponent.maxHP}]❤️
--------------------Події--------------------
${this.history.slice(-5).map(el => `${el}\n`).join('')}`;
    }

    formMainBattleButtons(){
        return {inline_keyboard:[
            [
                {text: `Зараз ходить: ${this._currentActor.name}`, callback_data: '{"q": "award_control", "a": ""}'},
            ],
            [
                {text: `🫁 Витривалість: ${this._currentActor.stamina}/${this._currentActor.maxStamina}`, callback_data: '{"q": "award_control", "a": ""}'},
            ],
            [
                {text: '☑️ Завершити крок', callback_data: '{"q": "main_battle", "a": "end_step"}'},
            ],
            [
                {text: '🗡 Меч хряка', callback_data: '{"q": "main_battle", "a": "weapon"}'},
                {text: '🛡 Щіт "Оу"', callback_data: '{"q": "main_battle", "a": "left_hand"}'},
            ],
            [
                {text: `❇️ Стан`, callback_data: '{"q": "main_battle", "a": "status"}'},
                // {text: `❔ Характеристики`, callback_data: '{"q": "main_battle", "a": "charact"}'},
            ],
            //TODO:
            // [
            //     {text: '✨ Вміння', callback_data: '{"q": "main_battle", "a": "skills"}'},
            //     {text: '👝 Предмети', callback_data: '{"q": "main_battle", "a": "take"}'},
            // ],
            [
                {text: '🏃 Втекти (33%)', callback_data: '{"q": "main_battle", "a": "run"}'},
                {text: '🚪 Здатись', callback_data: '{"q": "main_battle", "a": "surrender"}'},
            ]
        ]};
    }

    formLimbBattleButtons(){
        return {
            inline_keyboard:[
                [
                    {text: `Зараз ходить: ${this._currentActor.name}`, callback_data: 'null'},
                ],
                [
                    {text: `🫁 Витривалість: ${this._currentActor.stamina}/${this._currentActor.maxStamina}`, callback_data: 'null'},
                ],
                [
                    {text: '☑️ Завершити крок', callback_data: '{"q": "main_battle", "a": "end_step"}'},
                ],
                [
                    // {text: `Твій ворог: ${this.nextActor.name} [${this.nextActor.hp}/${this.nextActor.maxHP}]`, callback_data: 'null'},
                    {text: `Вдарити ${this.nextActor.name}  [50🫁]: [${this.nextActor.hp}/${this.nextActor.maxHP}]❤️`, callback_data: 'null'},
                ],
                [
                    {text: ' ', callback_data: 'null'},
                    {text: '😐', callback_data: '{"q": "battle_control", "a": "att_head"}'},
                    {text: ' ', callback_data: 'null'},
                ],
                [
                    {text: '🗡', callback_data: '{"q": "battle_control", "a": "att_rhand"}'},
                    {text: '❤️', callback_data: '{"q": "battle_control", "a": "att_ches"}'},
                    {text: '🛡', callback_data: '{"q": "battle_control", "a": "att_lhand"}'},
                ],
                [
                    {text: ' ', callback_data: 'null'},
                    {text: '🦵🦵', callback_data: '{"q": "battle_control", "a": "att_leg"}'},
                    {text: ' ', callback_data: 'null'},
                ],
                [
                    {text: '⬅️ Назад', callback_data: '{"q": "battle_control", "a": "toMain"}'},
                ],
            ]
        }
    }

    formLimbFriendlyButtons(){
        return {
            inline_keyboard:[
                [
                    {text: `Зараз ходить: ${this._currentActor.name}`, callback_data: 'null'},
                ],
                [
                    {text: `🫁 Витривалість: ${this._currentActor.stamina}/${this._currentActor.maxStamina}`, callback_data: 'null'},
                ],
                [
                    {text: '☑️ Завершити крок', callback_data: '{"q": "main_battle", "a": "end_step"}'},
                ],
                [
                    {text: 'Блокувати [50🫁]:', callback_data: '{"q": "main_battle", "a": "end_step"}'},
                ],
                [
                    {text: ' ', callback_data: 'null'},
                    {text: '😐', callback_data: '{"q": "friendly_control", "a": "use_head"}'},
                    {text: ' ', callback_data: 'null'},
                ],
                [
                    {text: '🗡', callback_data: '{"q": "friendly_control", "a": "use_rhand"}'},
                    {text: '❤️', callback_data: '{"q": "friendly_control", "a": "use_ches"}'},
                    {text: '🛡', callback_data: '{"q": "friendly_control", "a": "use_lhand"}'},
                ],
                [
                    {text: ' ', callback_data: 'null'},
                    {text: '🦵🦵', callback_data: '{"q": "friendly_control", "a": "use_leg"}'},
                    {text: ' ', callback_data: 'null'},
                ],
                [
                    {text: '⬅️ Назад', callback_data: '{"q": "battle_control", "a": "toMain"}'},
                ],
            ]
        }
    }

    formToMenuButton(){
        return {inline_keyboard:[
            [
                {text: `Зараз ходить: ${this._currentActor.name}`, callback_data: '{"q": "award_control", "a": ""}'},
            ],
            [
                {text: '⬅️ Назад', callback_data: '{"q": "battle_control", "a": "toMain"}'},
            ]
        ]}
    }

    formEffectsMessage(){
        return `Стан персонажа <b>${this._currentActor.name}</b>:
Здоров'я: ${this._currentActor.hp}/${this._currentActor.maxHP}❤️
Витривалість: ${this._currentActor.stamina}/${this._currentActor.maxStamina}🫁
Відновлення витривалості за крок: +${this.currentActor.staminaRegenerateRate}🫁
Точність: ${this.currentActor.hitProbability}🎯

Приголомшений 💫: ${this.currentActor.isStunned ? 'Так' : 'Ні'}
Кроків до кінця приголомшення: ${this.currentActor.stunDuration}👣

😐 Захист голови: {НЕ РЕАЛІЗОВАНО}🛡
💪💪 Захист рук: {НЕ РЕАЛІЗОВАНО}🛡
❤️ Захист грудної клітини: {НЕ РЕАЛІЗОВАНО}🛡
🦵🦵 Захист ніг: {НЕ РЕАЛІЗОВАНО}🛡

Голова: ${this.currentActor.isHeadDamged ? '❌' : '✅'}😐
Права рука: ${this.currentActor.isRightHandDamaged ? '❌' : '✅'}💪
Ліва рука: ${this.currentActor.isLeftHandDamaged ? '❌' : '✅'}💪
Грудна клітина: ${this.currentActor.isChestDamaged ? '❌' : '✅'}❤️
Ноги: ${this.currentActor.isLegsDamaged ? '❌' : '✅'}🦵🦵

Ефекти:
⚪️ В данжі
🟢 Регенерація (+5❤️ в секунду)
🔴 Кровотеча (-5❤️ в секунду)`
    }

    formSkillsButtons(){

    }

    formItemsButtons(){

    }

    formConfirmRunAwayButtons(){
        return {inline_keyboard:[
            [
                {text: `${this._currentActor.name}, ти дійсно хочеш втекти з шансом 33%?`, callback_data: 'null'},
            ],
            [
                {text: '🏃 Втекти (33%)', callback_data: '{"q": "main_battle", "a": "surr_con"}'},
            ],
            [
                {text: '⬅️ Не хочу', callback_data: '{"q": "battle_control", "a": "toMain"}'},
            ]
        ]}
    }

    formConfirmSurrender(){
        return {inline_keyboard:[
            [
                {text: `${this._currentActor.name}, ти дійсно хочеш здатись?`, callback_data: 'null'},
            ],
            [
                {text: '🚪 Здатись', callback_data: '{"q": "main_battle", "a": "sur_con"}'},
            ],
            [
                {text: '⬅️ Не хочу', callback_data: '{"q": "battle_control", "a": "toMain"}'},
            ]
        ]}
    }

    formPassStepButtons(){

    }

    formAttackSelectButtons(){

    }


    updateMessage(){
        this._bot.editMessageText(
            this._currentBattleMessageFuncton(),
            {inline_message_id: this._id, parse_mode: "HTML", reply_markup: this._currentBattleMarkupFunction()});
    }

    // updateMessage(){
    //     this._bot.editMessageText(
    //         this.formArticleText(), 
    //         {inline_message_id: this._id, parse_mode: "HTML", reply_markup:{
    //             inline_keyboard:[
    //                 [
    //                     {text: `🫁 Витривалість: ${this.currentActor.stamina}/${this.currentActor.maxStamina}`, callback_data: '{"q": "award_control", "a": "down"}'},
    //                 ],
    //                 [
    //                     {text: `${this.nextActor.name} [${this.nextActor.hp}/${this.nextActor.maxHP}]`, callback_data: '{"q": "award_control", "a": "down"}'},
    //                 ],
    //                 [
    //                     {text: '🗡 [🫁 50]', callback_data: '{"q": "b_a", "a": "aut_att"}'},
    //                     {text: '*🗡* [🫁 100]', callback_data: '{"q": "b_a", "a": "str_att"}'},
    //                 ],
    //                 [
    //                     {text: '🛡 [🫁 50]', callback_data: '{"q": "b_a", "a": "block"}'},
    //                 ],
    //             ]
    //         },});
    // }

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