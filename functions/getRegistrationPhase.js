module.exports = async function(userId){
    const getUser = require('../functions/getUser');

    const user = await getUser(userId);

    if(user.utils && user.utils.registrationStage){
        return user.utils.registrationStage
    }else{
        return 0
    }
}