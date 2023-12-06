const chatList = [];

function addMessage ( username, message ) {
    const newMessageCombo = { username, message };
    chatList.push(newMessageCombo);
    return chatList;
}

function getChatList () {
    return chatList;
}

module.exports = {
    addMessage,
    getChatList,
}