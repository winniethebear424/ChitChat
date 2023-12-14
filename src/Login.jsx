//Login.jsx
import { useState } from "react";
import { errors } from '../backend/models/errors.js'

function Login({onLogin}){
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // login api call
    function handleLoginSubmit(){
        const newUser = { username: username };
        fetch('/api/v1/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newUser)
        })
        .catch(() => Promise.reject({ error: "networkError" }))
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorData) => Promise.reject({ error: errorData.error }));
                }
                return response.json();
            })
            .then((data)=>{
                const onlineUsers = data.onlineUsers;
                const user = data.username;
                
                fetch('/api/v1/chat', {
                    method: 'GET',
                })
                    .then((response)=>{
                        if(!response.ok){
                            setErrorMessage(errors(error.error) || "Unknown error")
                        }
                        return response.json();
                    })
                    .then((data)=>{
                        const chatList = data;
                        onLogin(user, onlineUsers, chatList)
                    })
                    .catch((error)=>{
                        setErrorMessage(errors(error.error) || "Unknown error")
                    });
            })
            .catch((error)=>{
                setErrorMessage(errors(error.error) || "Unknown error")
            })
    };

    return (
        <div className="login">
            <form>
                <h1>Chit Chat</h1>
                <h2>Chat with friends around the world!</h2>
            <label>
              <h5>Please Login</h5>
              <span> Username: </span>
                <input 
                    type = "text"
                    placeholder = "Enter username here"
                    value = { username }
                    onInput = {(e)=>setUsername(e.target.value)}
                />
                </label>
                <button 
                    type = "button"
                    onClick = { handleLoginSubmit }>Login
                </button>
            </form>
            {errorMessage && <p className='error'>{errorMessage}</p> }
        </div>
    )
}

export default Login;
