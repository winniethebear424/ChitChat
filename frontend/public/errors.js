import { useState } from 'react';


const Err = {
    'Bad Request': 'users name invalid, please try again',
    'Forbidden': 'Wrong Password',
    'no username': 'please enter a username',
    'network-error': 'network error, please try again',
    'unknown-error': 'unknown error, please try later',
    'no message': 'please enter a message',
    'HTTP error': 'HTTP error, please try again',
    'no user': 'You are not a valid user',
}

export function errors(){
    const [errorMessage, setErrorMessage] = useState('');
    if (Err[errorType]){
        return setErrorMessage(Err[errorType]);
    } else{
        return setErrorMessage(Err['unknown-error'])
    }
    return ;
}
