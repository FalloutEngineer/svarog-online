const User = require('../models/user');

module.exports = async function(id){
    let user;
    try{
        user = await User.findOne({
            id: id
        })
    } catch(err){
        console.log(err);
    }

    return user;
};