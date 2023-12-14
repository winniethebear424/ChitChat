//sessions.js
const uuid = require('uuid').v4;

let sessions = {};

function createSession(username){
    const sessionId = uuid();
    sessions[sessionId] = username;
    return sessionId;
}

function getUsername(sessionId){
    return sessions[sessionId];
}

function deleteSession(sessionId){
    delete sessions[sessionId];
    return;
}


module.exports = {createSession, getUsername, deleteSession}