import { useState } from 'react'
import './App.css'
import Login from './Login';
import Chat from './Chat';
import { errors } from '../public/errors.js'


const App = () => {
  const [loggedIn, setLoggedIn] = useState('');
  const [username, setUsername] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (user, onlineUsers, chatList) => {
    setLoggedIn(true);
    setUsername(user);
    setOnlineUsers(onlineUsers);
    setMessages(chatList);
    console.log("checking chatList in handleLogin of App.jsx:",chatList);
  };

  const handleLogout = () => {
    const user = username;
    fetch('/api/v1/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify( {user} )
    })
      .then((response)=>{
        if(!response.ok){console.log("error in logout")}
        return response.json();
      })
      .then((data)=>{console.log("logout successfully")})
      .catch((error)=>{setErrorMessage(errors[error.error] || "Unknown error")});
      setLoggedIn(false);
      setUsername('');
  };

  // const handleLoginChat = (chatList) => {
  //   setMessages([chatList]);
  //   console.log("checking chatList in App.jsx:",chatList);
  // }

  return (
    <div className='app'>
      {loggedIn
      ? <Chat username = {username} onLogout = {handleLogout} onlineUsers = {onlineUsers} onlineChat = {messages}/>
      : <Login onLogin = {handleLogin}/>
      }
    </div>
  )
}

export default App
