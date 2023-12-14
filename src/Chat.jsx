import { useState, useEffect } from "react";
import { errors } from '../backend/models/errors.js'

function Chat({username, onLogout, onlineUsers, onlineChat, onProfile}){
    const [onlineUsersList, setOnlineUsersList] = useState([]);// online users
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

useEffect(() => { 
    setMessages(onlineChat);
    setOnlineUsersList(onlineUsers);

    const interval = setInterval(() => {
        fetch('/api/v1/online-users',{
            method: 'GET',
        })
            .then((response)=>{
                if(!response.ok){
                    const errorData = response.json();
                    setErrorMessage(errors(errorData.error) || "Unknown error")
                }
                return response.json();
            })
            .then((data) => {
                setOnlineUsersList(data.onlineUsers);
            })
            .catch((error)=>{
                setErrorMessage(errors(error.error) || "Unknown error")
            });
        fetch('/api/v1/chat', {
            method: 'GET',
        })
            .then((response)=>{
                if(!response.ok){
                    const errorData = response.json();
                    setErrorMessage(errors(errorData.error) || "Unknown error")
                }
                return response.json();
            })
            .then((data)=>{
                setMessages(data);
                setMessage(""); // Clear the input field after sending the message
            })
            .catch((error)=>{
                setErrorMessage(errors(error.error) || "Unknown error")
            });
    }, 5000)
} , [onlineUsers, onlineChat])

    function handleChatSubmit(){
        const newText = { username: username, message: message };
        fetch('/api/v1/new-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newText)
        })
            .then((response)=>{
                if(!response.ok){
                    const errorData = response.json();
                    setErrorMessage(errors(errorData.error) || "Unknown error1")
                }
                return response.json();
            })
            .then((data)=>{
                setMessages([...messages, data]);
                setMessage(""); // Clear the input field after sending the message
            })
            .catch((error)=>{
                setErrorMessage(errors(errorData.error) || "Unknown error2")
            });
    }

    return (

        <div className="chat">
            <header>
                <h1>Personal Profile</h1>
                <h2>Name: { username }</h2>
                <p></p>
                <button onClick={onLogout}>Logout</button>
            </header>

            {/* onlineuser */}
            <div className="users">
                <span>
                    <p><strong>Online Users:</strong></p>
                    {onlineUsersList.map((user, index) => (
                        <span key={index} className="existingUser">
                            {user}
                        </span>
                    ))}
                </span>
            </div> 

            {/* magsList */}
            <div className="texts">
                <span>
                    {messages.map((message, index) => (
                        <li key={index} className="existingText">
                            <strong>{message.username}</strong> {message.message}
                        </li>
                    ))}
                </span>
            </div>

            <input
                type="text"
                placeholder="Type a message here..."
                value = { message }
                onInput={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleChatSubmit}>Send</button>
            <br/>
            <button onClick={onProfile}>My Profile!</button>
            {errorMessage && <p className='error'>{errorMessage}</p>}
        </div>
    );
}
export default Chat;