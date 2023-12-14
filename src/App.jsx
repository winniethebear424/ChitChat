import { useState } from 'react'
import './App.css'
import Login from './Login';
import Chat from './Chat';
import PersonProfile from './PersonProfile.jsx';
import { errors } from '../backend/models/errors.js'


const App = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [personalProfile, setPersonalProfile] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = (user, onlineUsers, chatList) => {
    fetch('/api/v1/sid', {method: 'GET',})
    .then((response)=>{
      if(!response.ok){const errorData = response.json();
        setErrorMessage(errors(errorData.error) || "Unknown error")}
        return response.json();})
    .then((data)=>{setLoggedIn(true);})
    .catch((error)=>{setErrorMessage(errors(error.error) || "Unknown error")});
    
    setLoggedIn(true);
    setUsername(user);
    setOnlineUsers(onlineUsers);
    setMessages(chatList);
  };

  const handleLogout = () => {
    const user = username;
    fetch('/api/v1/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {user} )
    })
      .then((response)=>{
        if(!response.ok){setErrorMessage(errors[error.error] || "Unknown error")}
        return response.json();
      })
      .then((data)=>{
        setLoggedIn(false);
        setUsername('');        
    })
      .catch((error)=>{
        setErrorMessage(errors(error.error) || "Unknown error")
      });
  };

  const handleProfile =() =>{
    setPersonalProfile(true);
  }

  const handleBack = (newUserName, updatedUserList, updatedChatHistory) => {
    setLoggedIn(true);
    setPersonalProfile(false);
    setUsername(newUserName);
    setOnlineUsers(updatedUserList);
    setMessages(updatedChatHistory);
  }

  return (
    <div className='app'>
      {loggedIn
        ? (
          personalProfile ? (
            <PersonProfile user={username} goBack = {handleBack} />
          ) : (
            <Chat username = {username} onLogout = {handleLogout} onlineUsers = {onlineUsers} onlineChat = {messages} onProfile = {handleProfile} />
          )
        )
        : <Login onLogin={handleLogin} />}
      {errorMessage && <p className='error'>{errorMessage}</p>}
    </div>
  )
}

export default App
