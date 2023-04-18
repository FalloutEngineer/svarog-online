module.exports = function(msg){
    return msg.from.id == msg.chat.id;
}