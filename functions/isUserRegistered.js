const User = require('../models/user');
const isUserExists = require('./isUserExists');

module.exports = async function(userId){
    const getUser = require('../functions/getUser');
    const userExits = await isUserExists(userId);


    if(userExits){
        const user = await getUser(userId);

        if(user.util && user.util.registrationStage){
            if(user.util.registrationStage == 2){
                return true
            }
        }
    }
    
    return false;
}