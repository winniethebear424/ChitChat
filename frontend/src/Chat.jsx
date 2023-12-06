import { useState, useEffect } from "react";
import { errors } from "../public/errors.js"

function Chat({username, onLogout, onlineUsers, onlineChat}){
    const [onlineUsersList, setOnlineUsersList] = useState([]);// online users
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    console.log("onlineChat:",onlineChat);
    console.log("onlineUsers:",onlineUsers);
    
useEffect(() => { 
    setMessages(onlineChat);
    setOnlineUsersList(onlineUsers);
    console.log("checking onlineChat in useEffect of Chat.jsx:",onlineChat);
    console.log("checking onlineUsers in useEffect of Chat.jsx:",onlineUsers);

    const interval = setInterval(() => {
        fetch('/api/v1/online-users',{
            method: 'GET',
        })
            .then((response)=>{
                if(!response.ok){
                    setErrorMessage(errors[response.error] || "Unknown error")
                }
                return response.json();
            })
            .then((data) => {
                setOnlineUsersList(data.onlineUsers);
            })
            .catch((error)=>{
                setErrorMessage(errors[error.error] || "Unknown error")
            });
            console.log("2 checking onlineUsers in useEffect of Chat.jsx:",onlineUsers);
        fetch('/api/v1/chat', {
            method: 'GET',
        })
            .then((response)=>{
                if(!response.ok){
                    setErrorMessage(errors[response.error] || "Unknown error")
                }
                return response.json();
            })
            .then((data)=>{
                setMessages(data);
                setMessage(""); // Clear the input field after sending the message
            })
            .catch((error)=>{
                setErrorMessage(errors[error.error] || "Unknown error")
            });
            console.log("2 checking onlineChat in useEffect of Chat.jsx:",onlineChat);
    }, 10000)
    // return () => clearInterval(interval);
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
                    setErrorMessage(errors[response.error] || "Unknown error")
                }
                return response.json();
            })
            .then((data)=>{
                setMessages([...messages, data]);
                setMessage(""); // Clear the input field after sending the message
            })
            .catch((error)=>{
                setErrorMessage(errors[error.error] || "Unknown error")
            });
    }

    return (
        // magsList and onlineusers Panel
        <div className="chat">
            <header>
                <h1>Chat</h1>
                <h2>hello, { username }</h2>
                <button onClick={onLogout}>Logout</button>
            </header>

            {/* onlineuser */}
            <div className="users">
                {/* <p>Online Users:</p>
                <span className="existingUser">Bob</span> */}
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
        </div>
    );
}
export default Chat;