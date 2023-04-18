module.exports = class BattleArticlePlaceholder{
    get(){
        return {
            id: 2,
            type: "article",
            title: "Начять битву з ящюром",
            input_message_content: {
                message_text:
`
Битва незабаром розпочнеться...
`,
                parse_mode: 'HTML'
            },
            description: "Виходь на битву!",
            reply_markup:{
                inline_keyboard:[
                    [
                        {text: 'Так', callback_data: '{"q": "battle", "a": "yashur"}'},
                    ],
                    [
                        {text: 'Ні', callback_data: '{"q": "battle", "a": "decline"}'},
                    ],
                ]
            },
        };
    }
}