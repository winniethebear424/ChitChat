// server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

const session = require('./backend/models/sessions');
const users = require('./backend/models/users');
const chatHistory = require('./backend/models/chatHistory');

app.use((req, res, next)=>{
    const sid = req.cookies.sessionId;
    const username = session.getUsername(sid);
    if (req.url === '/api/v1/login' || req.url === '/api/v1/logout'){
        next();
    } else {
        if (sid && username){
            next();
        }
        if(!sid){
        res.status(401).json({error: 'Unauthorized, in the middleware'});
        return;
        }
        if(!username){
            res.status(403).json({error: 'Unauthorized uname, in the middleware'});
            return;
        }
    }
    next();
});

//API endpoints
app.get('/api/v1', (req, res) => { 
    const sessionId = req.cookies.sessionId;
    const username = session.getUsername(sessionId);
    res.status(200).json({username: username});
});

app.post('/api/v1/login', (req, res) => {
    const username = req.body.username;
    if(username){
        const sid = session.createSession(username);
        res.cookie('sessionId', sid);
        if (!users.isValidUserName(username)){
            res.status(400).json({error: 'Bad Request'});
        } else if (username === 'dog'){
            res.status(403).json({error: 'Forbidden'});
        }
        else {
            if  (!users.getOnlineUsers().includes(username)) {
                users.addUser(username);
            }
            const usersList = users.getOnlineUsers();
            res.status(200).json({username: username, onlineUsers: usersList});
        }
    } else {
        res.status(401).json({error: 'no username'});
    }
});

app.post('/api/v1/new-chat',(req,res)=>{
    const message = req.body.message;
    const username = req.body.username;

    if(message || message.trim() !== '' ){
        chatHistory.addMessage(username, message);
        res.status(200).json({username: username, message: message});
    } else {
        return res.status(400).json({error: 'no message'});
    }
})

app.post('/api/v1/logout',(req,res) => {
    const {user} = req.body;
    const sid = req.cookies.sessionId;
    if(user){
        users.removeUser(user);
        session.deleteSession(sid);
        res.status(200).json({message: 'Logged out'});
    } else {
        res.status(400).json({error: 'no user'});
    }
    
})

app.get('/api/v1/chat',(req,res)=>{
    const chatList = chatHistory.getChatList();
    res.status(200).json( chatList );
})

app.get('/api/v1/sid', (req,res) => {
    const sid = req.cookies.sessionId;
    res.status(200).json({sessionId: sid});
})

app.get('/api/v1/online-users', (req,res) => {
    const onlineUsers = users.getOnlineUsers();
    res.status(200).json({ onlineUsers })
})

app.post('/api/v1/change-name', (req, res) =>{
    const sid = req.cookies.sessionId;
    const oldName = session.getUsername(sid);
    const newName = req.body.newName;
    if(oldName && newName){
        if ( newName === oldName){
            return res.status(400).json({ error: 'Bad Request' });
        }
        if (!users.isValidUserName(newName)){
            return res.status(400).json({error: 'Bad Request'});
        }  
        if (newName === 'dog'){
            return res.status(403).json({error: 'Forbidden'});
        }   
        else {
            users.changeUserName(oldName , newName);
            chatHistory.nameChanged(oldName, newName);
            const updatedUsersList = users.getOnlineUsers();
            const updatedChatHistory = chatHistory.getChatList();
            return res.status(200).json({ newName: newName, usersList: updatedUsersList, chatHistory: updatedChatHistory });                
        }     
    }    
    else {
        return res.status(400).json({error: 'Bad Request'});
    }
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));