// users.js
let onlineUsers = [];

//sanitize the username
function isValidUserName(username) {
    let isValid = true;
    isValid = isValid && typeof username === 'string' && username.trim() !== '';
    isValid = isValid && username.match(/^[a-z][a-z0-9]{2,19}$/i);
    return isValid;
}

function addUser(username){
    onlineUsers.push(username);
    return onlineUsers;
}

function getOnlineUsers(){
    return onlineUsers;
}

function removeUser(username){
    for (let i = 0; i < onlineUsers.length; i++){
        if (onlineUsers[i] === username){
            onlineUsers.splice(i,1);
        }
    }
}
module.exports = {
    isValidUserName,
    addUser,
    getOnlineUsers,
    removeUser
}