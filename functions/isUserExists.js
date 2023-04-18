const User = require('../models/user');

module.exports = async function isUserExists(id){
    let user = await User.exists({id: id})
    if(user){
        return true;
    }
    return false;
}