module.exports = class Weapon{ //Kind of item?
    constructor(WeaponCharacteristics){
        this._name = WeaponCharacteristics.name; //String
        this._customName = null; //TODO: null or string
        this._damage = WeaponCharacteristics.damage; //TODO: class Damage, lose more durability when attack with wrong damage.
        this._type = WeaponCharacteristics.type; //TODO: string? enum?
        this._staminaCost = WeaponCharacteristics.staminaCost; //float
        this._skills = WeaponCharacteristics.skills; //TODO: WeaponSkills class? []?
        this._rarity = WeaponCharacteristics.rarity; //Rarity ENUM
        this._tier = WeaponCharacteristics.tier; //0-8
        this._slot = WeaponCharacteristics.slot; //right, left, both
        this._baseMissChance = WeaponCharacteristics.missFactor; //0-100
        this._stunProbability = WeaponCharacteristics.stunProbability; //float 0-100
        this._critProbability = WeaponCharacteristics.critProbability; //float 0-100 (maybe double and tripple crits later)
        this._isBroken = false; //bool
        this._durability = WeaponCharacteristics.durability; //float 0-100, i think that we need to keep this value upon dungeon completion
        this._maxDurability = WeaponCharacteristics.maxDurability; //float 0-100
        this._durabilityDamageLossFactor = WeaponCharacteristics.durabilityDamageLossFactor; //float, base - 1, amount of durability that decreaces when attack or get attack

        this._soundEmitterSettings = WeaponCharacteristics.soundEmitterSettings; //TODO: custom phrases, depends on race, pack, etc

        this._soundEmitter = {
            //TODO: like in Hero class.
        }
    }

    autoAttack(){
        //return attack (durability, crit, miss or not, etc)
    }

    strongAttack(){
        //Return attack
        //Get cost?
        //Make in skill?
    }
    
    castSkill(){
        //How to cast? How call? How to select?
    }

    fix(amount){ // When restore durability?
        if(this._durability + amount >= this._maxDurability){
            this._durability = this._maxDurability;
        }else{
            this._durability += amount;
        }
    }

    takeAttack(attack){
        //calculate durability, damage type change, etc
    }

}