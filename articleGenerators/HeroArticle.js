module.exports = class HeroArticle{
    constructor(user, id){
        this._user = user;
        this._article = {
            id: id,
            type: "article",
            title: "Показать героя",
            input_message_content:{
                message_text:
`Ім'я: ${user.hero.name}
Здоров'я: ${user.hero.currentHP}/${user.hero.maxHP}❤️
LVL: ${user.hero.lvl}
XP: ${user.hero.xp}`,
            },
            description: "Давай-давай, покажи героя, не сци!",
        };
    }

    get(){
        return this._article;
    }
}