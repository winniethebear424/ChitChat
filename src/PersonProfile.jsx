import { useState, useEffect } from "react";
import { errors } from '../backend/models/errors.js'

function PersonProfile ({user, goBack}) {
    const [userName, setUserName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [updatedUserList, setUpdatedUserList] = useState([]);
    const [updatedChatHistory, setUpdatedChatHistory] = useState([]);

useEffect(() => {
    setUserName(user);
} , [user])

    function handleNameChange(userName){
        fetch('/api/v1/change-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newName: userName })
        })
            .then((response)=>{
                if(!response.ok){
                    const errorData = response.json();
                    setErrorMessage(errors(errorData.error) || "Unknown error")
                }
                return response.json();
            })
            .then((data)=>{
                setUserName(data.newName);
                setUpdatedUserList([...updatedUserList, data.usersList])
                setUpdatedChatHistory([...updatedChatHistory, data.chatHistory])
            })
            .catch((error)=>{
                setErrorMessage(errors(error.error) || "Unknown error")
            });
    }

    return (
        // magsList and onlineusers Panel
        <div className="changeName">
            <header>
                <h1>Personal Profile</h1>
                <h2>welcome, { userName } </h2>
                <button onClick = {()=>
                    goBack(userName, updatedUserList, updatedChatHistory) } > Back </button>

            </header>
            <label> To Change Name: </label>
            <input
                type = "text"
                placeholder = " Type Your New Name Here... "
                onChange={(event) => setUserName(event.target.value) }
            />
            <button 
                type="button"
                onClick = {() => 
                handleNameChange(userName) }> Change 
            </button>
            <br/>
            {errorMessage && <p className='error'> {errorMessage} </p>}
        </div>
    );
}
export default PersonProfile;