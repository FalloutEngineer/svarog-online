const User = require('../models/user');
const baseHeroValues = require('../default-values/hero.json');
const weaponsValues = require('../default-values/weapons.json');
module.exports = class Hero{
    constructor(player){
        this._player = player;

        this._playerId = player.id;

        this._name = player.hero.name;

        this._maxHP = player.hero.maxHP;
        this._currentHP = player.hero.currentHP;

        this._isDead = player.hero.isDead ?? false;

        this._isInBattle = player.hero.isInBattle ?? false;

        this._regenerationRate = player.hero.regenerationRate ?? 1;

        this._lvl = player.hero.lvl;
        this._xp = player.hero.xp;

        this._weapon = player.hero.weapon ?? weaponsValues.fists;
        this._leftHand = player.hero.leftHand ?? null;

        this._maxStamina = baseHeroValues.baseStamina;
        this._stamina = baseHeroValues.baseStamina;

        this._maxStaminaRegenerateRate = baseHeroValues.baseStaminaRegenerateRate;
        this._staminaRegenerateRate = baseHeroValues.baseStaminaRegenerateRate;

        //TODO: instead off null create empty armor
        this._headArmor = player.hero.headArmor ?? null;
        this._bodyArmor = player.hero.bodyArmor ?? null;
        this._footArmor = player.hero.footArmor ?? null;

        this._hitProbability = baseHeroValues.hitProbability; //TODO: personal hit probability

        //TODO: change user changes and abilities when damaged
        this._isHeadDamaged = false;
        this._isRightHandDamaged = false;
        this._isLeftHandDamaged = false;
        this._isChestDamaged = false;
        this._isLegsDamaged = false;

        //TODO:
        this._headDamageMultiplier = 1; 
        this._handsDamageMultiplier = 1;
        this._chestDamageMultiplier = 1;
        this._legsDamageMultiplier = 1;

        this._isHeadBlock = false;
        this._isChestBlock = false;
        this._isHandsBlock = false;
        this._isLegsBlock = false;

        this._isStunned = false; //TODO: if yes then reduce some characteristics. (or block some actions?)
        this._stunDuration = 0; //In steps

        this._effects = []; //TODO: maybe class? ПРОХОДИЦЯ ПО ВСІМ БАФАМ ТА ДЕБАФАМ, ВИКЛИКАТЬ ЇХ. ЕФЕКТАМ ІТД ПЕРЕДАВАТЬ КОЛБЕКИ ПРИ НАКЛАДАННІ.

        this._soundEmitterSettings = null; //TODO: custom phrases, depends on race, pack, etc

        this.soundEmitter = { //TODO: remove nick prefix, move to battle logs? Create battle logs class?
            ouch: function(){
                if(this.hp == 0){
                    return `[${this._name}]: Я здохній`;
                }
                return `[${this._name}]: Ауч! У мене : ${this.hp}`;
            }.bind(this),
    
            yeah: function(hp){
                return `[${this._name}]: О да дєтка. +${hp} хп!`;
            }.bind(this),
            attack: function(targetName){
                return `[${this._name}]: Получяй підарашка ${targetName}!`;
            }.bind(this),
            miss: function(){
                return`[${this._name}]: Блять я промазав!`;
            }.bind(this),
            revive: function(){
                return `[${this.name}]: Оуу є, я воскрєс!`;
            }.bind(this),
            limbOuch: function(limbName){
                return `[${this.name}]: Ай сламали |${limbName}|!`;
            }.bind(this),
            outOfStamina: function(){
                return `[${this.name}]: Ой немічне, в мене не вистачило сил!`;
            }.bind(this),
        }
    }

    //getters

    get playerId(){
        return this._playerId;
    }

    get name(){
        return this._name;
    }

    get hp(){
        return this._currentHP;
    }

    get maxHP(){
        return this._maxHP;
    }

    get xp(){
        return this._xp;
    }

    get remainingXp(){
        //TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    }

    get lvl(){
        return this._lvl;
    }

    get weapon(){
        return this._weapon;
    }

    get headArmor(){
        return this._headArmor;
    }

    get bodyArmor(){
        return this._bodyArmor;
    }

    get footArmor(){
        return this._footArmor;
    }

    get regenerationRateHP(){
        if(this._regenerationRate){
            return baseHeroValues.baseRegenerationValue * this._regenerationRate;
        }
        return baseHeroValues.baseRegenerationValue;
    }

    get isInBattle(){
        if(this._isInBattle){
            return this._isInBattle;
        }
        return false;
    }

    get isDead(){
        return this._isDead;
    }

    get hitProbability(){
        return this._hitProbability;
    }

    get maxStamina(){
        return this._maxStamina;
    }

    get stamina(){
        return this._stamina;
    }

    set stamina(value){
        if(value < 0){
            this._stamina = 0;
        }
        else if(value > this._maxStamina){
            this._stamina = this._maxStamina;
        } else{
            this._stamina = value;
        }
    }

    get staminaRegenerateRate(){
        return this._staminaRegenerateRate;
    }

    get isStunned(){
        return this._isStunned;
    }

    get stunDuration(){
        return this._stunDuration;
    }

    get isHeadDamged(){
        return this._isHeadDamaged;
    }
    get isChestDamaged(){
        return this._isChestDamaged;
    }
    get isRightHandDamaged(){
        return this._isRightHandDamaged;
    }
    get isLeftHandDamaged(){
        return this._isLeftHandDamaged;
    }
    get isLegsDamaged(){
        return this._isLegsDamaged;
    }

    handleStun(){
        //TODO:
    }

    //methogs

    enterBattle() {
        this._isInBattle = true;
    }

    exitBattle(){
        this._isInBattle = false;
    }

    async takeDamage(damage){ //Rework for "damage class"
        if(this._currentHP > 0){
            let damageCount = damage;

            if(damageCount > 0){
                // damageCount = damageCount * -1;
                damageCount = 0;
            }
            const healthAfterDamage = this._currentHP - damage;
            if(healthAfterDamage <= 0){
                this._currentHP = 0;
                this._isDead = true;
                this._updateIsDead();
            }else{
                this._currentHP = healthAfterDamage;
            }

            const answer = this._updateHP();

            return answer;
        }
        const answer = {
            code: 100,
            isError: false,
            answer: this.hp
        }

        return answer;
    }

    async setBlock(limb){

    }

    async removeBlock(){

    }

    // async takeDamageInHead(damage){
    //     if(this._currentHP > 0){
    //         let damageCount = damage;

    //         if(damageCount > 0){
    //             // damageCount = damageCount * -1;
    //             damageCount = 0;
    //         }
    //         const healthAfterDamage = this._currentHP - damage;
    //         if(healthAfterDamage <= 0){
    //             this._currentHP = 0;
    //             this._isDead = true;
    //             this._updateIsDead();
    //         }else{
    //             this._currentHP = healthAfterDamage;
    //         }

    //         const answer = this._updateHP();

    //         return answer;
    //     }
    //     const answer = {
    //         code: 100,
    //         isError: false,
    //         answer: this.hp
    //     }

    //     return answer;
    // }

    // async takeDamageInLegs(damage){

    // }

    // async takeDamageInRightHand(damage){

    // }

    // async takeDamageInLeftHand(damage){

    // }

    // async takeDamageInChest(damage){

    // }

    async heal(health){
        let healthCount = health;
        if(this.hp != this.maxHP){
            if(healthCount < 0){
                healthCount = 0;
            }
            const healthAfterHeal = this._currentHP + healthCount;
    
            if(healthAfterHeal >= this.maxHP){
                this._currentHP = this.maxHP;
            }else{
                this._currentHP = healthAfterHeal;
            }
    
            const answer = this._updateHP();
    
            this.tryRevive()

            return answer;
        }
        const answer = {
            code: 100,
            isError: false,
            answer: {additionalHealth: health, newHP: this.hp}
        }

        return answer;
    }

    async tryRevive(){
        const answer = {
            code: 100,
            isError: false,
            answer: {isDead: this.isDead, revived: false}
        }

        if((this.hp >= 100) && this.isDead){
            this._isDead = false;
            await this._updateIsDead();

            answer.revived = true;
        }

        answer.isDead = this.isDead;

        return answer;
    }

    attack(target, limb){
        const answer = {
            code: 100,
            isError: false,
            answer: {isMiss: false, isOutOfStamina: false, weapon: {name: "nothing"}}
        }
        const hitNumber = Math.floor(Math.random() * (100 - 0 + 1) + 0);

        if(this.weapon){
            answer.answer.weapon = this.weapon;
            if(this.stamina >= this.weapon.staminaCost){
                this.drainStamina(this.weapon.staminaCost);
                console.log(`current hero stamina: ${this.stamina}`);
                if(hitNumber < this.hitProbability){
                    target.takeDamage(this.weapon.damage, limb);
                }else{
                    answer.answer.isMiss = true;
                }
            } else{
                answer.answer.isOutOfStamina = true;
            }
        }
        return answer;
    }

    strongAttack(target){
        const answer = {
            code: 100,
            isError: false,
            answer: {isMiss: false, isOutOfStamina: false, weapon: {name: "nothing"}}
        }
        const hitNumber = Math.floor(Math.random() * (100 - 0 + 1) + 0);

        if(this.weapon){
            answer.answer.weapon = this.weapon;
            if(this.stamina >= this.weapon.staminaCost * 2){
                this.drainStamina(this.weapon.staminaCost * 2);
                console.log(`current hero stamina: ${this.stamina}`);
                if(hitNumber < this.hitProbability){
                    target.takeDamage(this.weapon.damage * 2);
                }else{
                    answer.answer.isMiss = true;
                }
            }else{
                answer.answer.isOutOfStamina = true;
            }
        }
        return answer;
    }

    async drainStamina(amount){
        this.stamina -= amount;
    }

    async regenerateStamina(amount){
        this.stamina += amount;
    }

    async restoreStaminaForStep(){
        this.stamina += this._staminaRegenerateRate;
    }

    async actionsBeforeStep(){
        this.restoreStaminaForStep();
    }

    async takeMoney(amount){
        //TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    }

    async spendMoney(amount){
        //TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    }

    async takeXP(amount){
        //TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    }

    async lvlUpHandler(){
        //TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:TODO:
    }

    async healIfAlive(health){
        let answer = {
            code: 100,
            isError: false,
            answer: this.hp
        };
        if(!player.isDead){
            answer = await this.heal(health);
        }

        return answer;
    }

    async regenerate(){
        let answer = {
            code: 100,
            isError: false,
            answer: this.hp
        };
        if(this.isInBattle){
            return answer;
        }
        answer = await this.heal(this.regenerationRateHP);
        return answer;
    }
    
    // async _updateBattleState(){
    //     try{
    //         const updatedUser = await User.findOneAndUpdate({id: this._playerId}, {"$set": {'hero.isInBattle': this._isInBattle}});

    //         let answer = {
    //             code: 100,
    //             isError: false,
    //             answer: updatedUser.hero.isDead
    //         }
    
    //         return answer;
    //     }catch(e){
    //         console.log(e);

    //         let answer = {
    //             code: e.code,
    //             isError: true,
    //             answer: e
    //         }

    //         return answer;
    //     }
    // }

    async _updateIsDead(){
        try{
            const updatedUser = await User.findOneAndUpdate({id: this._playerId}, {"$set": {'hero.isDead': this._isDead}});

            let answer = {
                code: 100,
                isError: false,
                answer: updatedUser.hero.isDead
            }
    
            return answer;
        }catch(e){
            console.log(e);

            let answer = {
                code: e.code,
                isError: true,
                answer: e
            }

            return answer;
        }
    }

    async _updateHP(){
        try{
            const updatedUser = await User.findOneAndUpdate({id: this._playerId}, {"$set": {'hero.currentHP': this._currentHP}});

            let answer = {
                code: 100,
                isError: false,
                answer: updatedUser.hero.currentHP
            }

            return answer;

        }catch(e){
            console.log(e);

            let answer = {
                code: e.code,
                isError: true,
                answer: e
            }

            return answer;
        }
    }

    async _updateMoney(){

    }

    async _updateLvl(){

    }

    async _updateXP(){

    }
}