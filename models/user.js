const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id:{
        type: Number,
        required: true,
        unique: true
    },
    hero:{
        name: String,
        maxHP: Number,
        currentHP: Number,
        regenerationRate: Number,
        isInBattle: Boolean,
        isDead: Boolean,
        lvl: Number,
        xp: Number,
        weapon: Number,
        headArmor: Number,
        bodyArmor: Number,
        footArmor: Number,
    },
    money: {
        type: Number
    },
    inventory: {
        type: Array
    },
    skills:{
        maxHP: Number,
    },
    util:{
        registrationStage: Number,
    }
});

module.exports = mongoose.model('User', userSchema);


