module.exports = class Mob{
    constructor(mobPreset){
        this._id = 0;

        this._name = mobPreset.name;
        this._maxHP = mobPreset.maxHP;
        this._currentHP = mobPreset.maxHP;
        this._weapon = mobPreset.weapon;
        this._lvl = mobPreset.lvl;
        this._isDead = false;
        
        this._headArmor = mobPreset.headArmor;
        this._bodyArmor = mobPreset.bodyArmor;
        this._footArmor = mobPreset.footArmor;

        this._hitProbability = mobPreset.hitProbability ?? 50;

        this._maxStamina = mobPreset.baseStamina;
        this._stamina = mobPreset.baseStamina;

        this._maxStaminaRegenerateRate = mobPreset.baseStaminaRegenerateRate;
        this._staminaRegenerateRate = mobPreset.baseStaminaRegenerateRate;

        this.soundEmitter = {
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
            outOfStamina: function(){
                return `[${this.name}]: Ой немічне, в мене не вистачило сил!`;
            }.bind(this),
        }
    }

    //GETTERS

    get name(){
        return this._name;
    }

    get maxHP(){
        return this._maxHP;
    }

    get hp(){
        return this._currentHP;
    }

    get weapon(){
        return this._weapon;
    }

    get lvl(){
        return this._lvl;
    }

    get isDead(){
        return this._isDead;
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

    get id(){
        return this._id;
    }

    set id(newId){
        this._id = newId;
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
        console.log(`current mob stamina: ${value}`);
        if(value < 0){
            this._stamina = 0;
        }
        else if(value > this._maxStamina){
            this._stamina = this._maxStamina;
        } else{
            this._stamina = value;
        }
    }

    //methods

    async takeDamage(damage, limb){
        
        if(this._currentHP > 0){
            let damageCount = damage;

            if(damageCount > 0){
                damageCount = 0;
            }
            const healthAfterDamage = this._currentHP - damage;
            if(healthAfterDamage <= 0){
                this._currentHP = 0;
                this._isDead = true;
            }else{
                this._currentHP = healthAfterDamage;
            }
        }
        const answer = {
            code: 100,
            isError: false,
            answer: this.hp
        }

        return answer;
    }

    async takeDamageInHead(damage){

    }

    async takeDamageInRightHand(damage){

    }

    async takeDamageInLeftHand(damage){

    }

    async takeDamageInChest(damage){

    }

    async takeDamageInLegs(damage){

    }

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
    
            this.yeah(healthCount);

            return answer;
        }
        const answer = {
            code: 100,
            isError: false,
            answer: this.hp
        }

        return answer;
    }

    // attack(target){
    //     const answer = {
    //         code: 100,
    //         isError: false,
    //         answer: {isMiss: false, weapon: {name: "nothing"}}
    //     }

    //     const hitNumber = Math.floor(Math.random() * (100 - 0 + 1) + 0);

    //     if(this.weapon){
    //         answer.answer.weapon = this.weapon;
    //         if(hitNumber < this.hitProbability){
    //             target.takeDamage(this.weapon.damage);
    //         }else{
    //             answer.answer.isMiss = true;
    //         }
    //     }
    //     return answer;
    // }

    attack(target){
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
                if(hitNumber < this.hitProbability){
                    target.takeDamage(this.weapon.damage);
                }else{
                    answer.answer.isMiss = true;
                }
            } else{
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
}