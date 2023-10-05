import { getAuth
    , signOut
    , onAuthStateChanged
    , signInWithEmailAndPassword
    , createUserWithEmailAndPassword  
} from "firebase/auth";


export const registrerWithEmail = async (emailH, passwordH) => {
    const auth = getAuth(); 
    return createUserWithEmailAndPassword(auth, emailH, passwordH).then((userCredential) => { 
        const user = userCredential.user;  
        return { user }
    }).catch((error) => { 
        const errorCode = error.code;
        const errorMessage = error.message;  
        return { 
            error: errorCode + ': ' + errorMessage
        }
    })

}


export const signWithEmail = async (signInEmail, signInPassword) => { 
    const auth = getAuth();
    
    return signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {  
        const user = userCredential.user; 
        return { user }
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Error: ', errorCode + ': ' + errorMessage) 
        return { 
            error: errorCode + ': ' + errorMessage
        }
    })

}


export const signOutUser = async () => {  
    const auth = getAuth();
    return signOut(auth).then(() => { 
        return {
            suscess: true
        }
    }).catch((error) => { 
        return {
            error
        }
    })

}

export const authState = async (userFnc) => {
    const auth = getAuth();
    onAuthStateChanged(auth, userFnc); 
}

export const getCurrentUser = () => { 
    const auth = getAuth();
    const user = auth.currentUser; 
    return user 
}