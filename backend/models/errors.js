
const Err = {
    'Bad Request': 'users name invalid, please try again, username should be 3-20 letters',
    'Forbidden': 'Wrong Password',
    'no username': 'please enter a username',
    'network-error': 'network error, please try again',
    'unknown-error': 'unknown error, please try later',
    'no message': 'please enter a message',
    'HTTP error': 'HTTP error, please try again',
    'no user': 'You are not a valid user',
    'logout successfully': 'logout successfully',
    'Name changed': 'Name changed successfully',
    'change name failed':'change name failed, please input a valid name which should be 3-20 letters'
}

export function errors(errorType){
    if (Err[errorType]){
        return Err[errorType];
    } else{
        return 'network error, please try again later';
    }
}
