const chatList = [];

function addMessage ( username, message ) {
    const newMessageCombo = { username, message };
    chatList.push(newMessageCombo);
    return chatList;
}

function getChatList () {
    return chatList;
}

function nameChanged (oldName, newName) {
    for (let i = 0; i < chatList.length; i++){
        if (chatList[i].username === oldName){
            chatList[i].username = newName;
        }
    }
    return chatList;
}

module.exports = {
    addMessage,
    getChatList,
    nameChanged,
}