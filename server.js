// server.js

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.static('./dist'));
app.use(express.json());

const session = require('./sessions');
const users = require('./users');
const chatHistory = require('./chatHistory');

app.use((req, res, next)=>{
    const sid = req.cookies.sessionId;
    const username = session.getUsername(sid);
    if (req.url === '/api/v1/login' || req.url === '/api/v1/logout'){
        next();
    } else {
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
    const sid = session.createSession(username);
    res.cookie('sessionId', sid);
    if(username){
        if (!users.isValidUserName(username)){
            res.status(400).json({error: 'Bad Request'});
            return;
        } else if (username === 'dog'){
            res.status(403).json({error: 'Forbidden'});
            return;
        }
        else {
            users.addUser(username);
            const usersList = users.getOnlineUsers();
            console.log('user:',username);
            console.log('adding user:',users.getOnlineUsers());
            res.status(200).json({username: username, onlineUsers: usersList});
        }
    } else {
        res.status(401).json({error: 'no username'});
    }

});

app.post('/api/v1/new-chat',(req,res)=>{
    const message = req.body.message;
    const username = req.body.username;

    if(!message){
        res.status(400).json({error: 'no message'});
        return;
    } else {
        chatHistory.addMessage(username, message);
        res.status(200).json({username: username, message: message});
    }
})

app.post('/api/v1/logout',(req,res) => {
    const {user} = req.body;
    const sid = req.cookies.sessionId;
    if(user){
        users.removeUser(user);
        console.log('user to be removed:',user);
        console.log('removing user:',users.getOnlineUsers());
        session.deleteSession(sid);
        res.status(200).json({message: 'Logged out'});
    } else {
        res.status(400).json({error: 'no user'});
    }
    
})

app.get('/api/v1/chat',(req,res)=>{
    const chatList = chatHistory.getChatList();
    console.log('chatlist:',chatList);
    res.status(200).json( chatList );
})

app.get('/api/v1/online-users', (req,res) => {
    const onlineUsers = users.getOnlineUsers();
    console.log('online users:',onlineUsers);
    res.status(200).json({ onlineUsers })
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));